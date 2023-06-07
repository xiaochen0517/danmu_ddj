<template>
  <div class="hello">
    <div class="float-box">
      <input type="text" v-model="port" />
      <button @click="openWS">connect</button>
      <span>{{ messageCount }}</span>
    </div>
    <DanmuMessage v-for="(item, index) in messageList" :key="index" :message="item" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import DanmuMessage from './DanmuMessage.vue';

import DanmuWebSocket from '@/utils/DanmuWebSocket';
import DanmuObject from '@/class/danmu/DanmuObject';

onMounted(() => {
  // const ws = new DanmuWebSocket(74751);
  // ws.connect((result) => {
  //   parseMessage(result);
  // }, () => {
  //   console.log('close connect');
  // }, (error) => {
  //   console.log(error);
  // });
});

const port = ref(2);
const openWS = () => {
  const ws = new DanmuWebSocket(74751, port.value);
  ws.connect((result) => {
    parseMessage(result);
  }, () => {
    console.log('close connect');
  }, (error) => {
    console.log(error);
  });
};

const parseMessage = (message: string) => {
  const params = message.split('/');
  const typeParam = params[0].split('@=');
  if (typeParam.length != 2 || typeParam[0] != 'type') {
    return;
  }
  const type = typeParam[1];
  if (type == 'chatmsg') {
    let messageObject: DanmuObject = {};
    for (const param of params) {
      const keyValues = param.split('@=');
      if (keyValues.length != 2) {
        continue;
      }
      const key = keyValues[0];
      const value = keyValues[1];
      messageObject[key] = value;
    }
    addMessage(messageObject);
  }
};

const messageList: Ref<Object[]> = ref([]);
const messageCount = ref(0);

const addMessage = (message: DanmuObject) => {
  if (messageList.value.length > 100) {
    messageList.value.shift();
  }
  messageList.value.push(message);
  messageCount.value++;
  scrollToBottom();
};

const scrollToBottom = () => {
  // 判断当前是否在底部
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  if (scrollHeight - scrollTop - clientHeight < 100) {
    setTimeout(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }, 100);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.float-box {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #aaa;
}
</style>
