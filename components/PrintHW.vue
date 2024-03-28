<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';
import observer from '@/entrypoints/observer';

const fetchData = async () => {
  // todo: implement extension
  // browser.runtime.sendMessage("extension_id", );

  browser.runtime.sendMessage({ action: "fetch_x_auth" });

  browser.runtime.onMessage.addListener(
    async function (request, sender) {
      console.log("Received message:", request.x_auth);

      try {
        // 替换 'your-api-url' 为你的 API 端点
        const response = await axios.get('https://twitter.com/i/api/graphql/uNowfj04D8HFVFMbjm6xrQ/Bookmarks', {
          headers: {
            Authorization: request.x_auth
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error('请求数据时出错:', error);
      }
    }
  );
};



const test = () => {
  console.log("here")
}

const data = ref("default");
</script>

<template>
  <button @click=test>{{ data }}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
