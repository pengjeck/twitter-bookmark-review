<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';

defineProps({
  msg: String,
});
let count = ref(0);
const data = ref("");

const fetchData = async () => {
  // todo: implement extension
  // browser.runtime.sendMessage("extension_id", );
  browser.runtime.sendMessage({ action: "fetch_x_auth" });
  data.value = "send message";
  browser.runtime.onMessage.addListener(
    function (request) {
      console.log("Received message:", request.x_auth);
      data.value = "received message";
      try {
        // 替换 'your-api-url' 为你的 API 端点
        // const response = await axios.get('https://twitter.com/i/api/graphql/uNowfj04D8HFVFMbjm6xrQ/Bookmarks', {
        //   headers: {
        //     Authorization: request.x_auth
        //   }
        // });
        // console.log(response.data);
        data.value = request.x_auth;
      } catch (error) {
        console.error('请求数据时出错:', error);
      }
    }
  );
};

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click=fetchData>count is {{ count }}</button>
    <p>
      Edit
      <code>{{ data }}</code> to test HMR
    </p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
