const NumberUtil = {
    /**
     * 获取随机数
     * @param min 最小值
     * @param max 最大值
     * @returns 随机数
     */
    getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
}

export default NumberUtil;