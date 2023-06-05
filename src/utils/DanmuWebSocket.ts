import NumberUtil from "./NumberUtil";

class DanmuWebSocket {

    private roomId: (number | string);

    private socket?: WebSocket;

    private timer?: number;

    private reader?: (FileReader | null);

    constructor(roomId: (number | string)) {
        this.roomId = roomId;
    }

    public connect(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(`wss://danmuproxy.douyu.com:850${NumberUtil.getRandom(2, 5)}`);
            this.socket.onopen = () => {
                this.socket?.send(this.WebSocketPacket("type@=loginreq/roomid@=" + this.roomId));
                this.socket?.send(this.WebSocketPacket("type@=joingroup/rid@=" + this.roomId + "/gid@=-9999/"));
                this.timer = setInterval(() => {
                    this.socket?.send(this.WebSocketPacket("type@=mrkl/"));
                }, 40000)
            };
            this.socket.onerror = (e) => {
                reject(e);
            }
            this.socket.onmessage = (response) => {
                this.reader = new FileReader();
                this.reader.onload = () => {
                    const messageList = String(this.reader?.result).split("\0"); // 分包
                    this.reader = null;
                    for (let i = 0; i < messageList.length; i++) {
                        if (messageList[i].length > 12) {
                            resolve(messageList[i]);
                        }
                    }
                };
                this.reader.readAsText(response.data);
            };
            this.socket.onclose = () => {
                reject("connection closed");
            };
        });
    }

    public close(): void {
        clearInterval(this.timer);
        this.socket?.close();
    }

    private WebSocketPacket(str: string): Uint8Array {
        const MSG_TYPE = 689;
        const bytesArr = this.stringToByte(str);
        const buffer = new Uint8Array(bytesArr.length + 4 + 4 + 2 + 1 + 1 + 1);
        const p_content = new Uint8Array(bytesArr.length); // 消息内容
        for (let i = 0; i < p_content.length; i++) {
            p_content[i] = bytesArr[i];
        }
        const p_length = new Uint32Array([bytesArr.length + 4 + 2 + 1 + 1 + 1]); // 消息长度
        const p_type = new Uint32Array([MSG_TYPE]); // 消息类型
    
        buffer.set(new Uint8Array(p_length.buffer), 0);
        buffer.set(new Uint8Array(p_length.buffer), 4);
        buffer.set(new Uint8Array(p_type.buffer), 8);
        buffer.set(p_content, 12);
    
        return buffer;
    }

    private stringToByte(str: string): Array<number> {
        const bytes = new Array();
        let c;
        for (let i = 0; i < str.length; i++) {
            c = String(str).charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }
}

export default DanmuWebSocket;