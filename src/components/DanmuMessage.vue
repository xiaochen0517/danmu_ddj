<template>
    <div class="danmu-message">
        <div class="user-level">{{ props.message.level }}</div>
        <div v-if="props.message.bl > 0" class="fans-card">{{ props.message.bl }} {{ props.message.bnn }}</div>
        <div class="user-name">{{ props.message.nn }} :</div>
        <div class="message"> {{ props.message.txt }}</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, defineProps as vueDefineProps } from 'vue';

import DanmuObject from '@/class/danmu/DanmuObject';

const props = vueDefineProps({
    message: {
        type: Object as () => DanmuObject,
        required: true
    }
});

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