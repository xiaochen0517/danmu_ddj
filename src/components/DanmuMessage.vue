<template>
    <div class="danmu-message">
        <div class="user-level">{{ message.level }}</div>
        <div v-if="message.bl > 0" class="fans-card">{{ message.bl }} {{ message.bnn }}</div>
        <div class="user-name">{{ message.nn }} :</div>
        <div class="message"> {{ message.txt }}</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, defineProps } from 'vue';

import DanmuObject from '@/class/danmu/DanmuObject';

interface Props {
    message: DanmuObject
}

const props = defineProps<Props>();

onMounted(() => {
    console.log(props.message);
})

</script>

<style scoped lang="less">
.danmu-message {
    display: flex;
    font-size: 16px;
    line-height: 24px;
    color: black;

    .user-level {
        width: 30px;
        margin: 5px 5px;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        border: 1px solid #aaa;
        border-radius: 5px;
    }

    .fans-card {
        padding: 0 5px;
        margin: 4px 5px;
        font-size: 14px;
        line-height: 16px;
        text-align: center;
        border: 1px solid #aaa;
        border-radius: 5px;
    }
}
</style>