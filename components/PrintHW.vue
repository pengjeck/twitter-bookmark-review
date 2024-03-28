<script lang="ts" setup>
import { ref } from 'vue';

const data = ref("default");
const test = () => {
  browser.runtime.onMessage.addListener(
    function (request) {
      console.log("Received message:", request.x_auth);
      data.value = request.x_auth
    }
  );

  browser.runtime.sendMessage({ action: "fetch_x_auth" });
  console.log("here")
}

</script>

<template>
  <button @click=test>{{ data }}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
