<script lang="ts" setup>
import { ref } from 'vue';
import TweetBox from '@/components/TweetBox.vue'
import { onUnmounted } from 'vue';
import { extractEntries, requestBookmark } from '@/public/utils/bookmark';
import { Tweet } from '@/public/model/TweetModel';
import { onBeforeMount } from 'vue';
import { onMounted } from 'vue';
import { onBeforeUnmount } from 'vue';

const ACTION_FETCH_X_AUTH = "fetch_x_auth";
const BOOKMARK_SIZE = 1;

let tweets = ref(Array<Tweet>());

onMounted(() => {
  console.log("mounted component of twitter bookmark review.");
})

onBeforeUnmount(() => {
  console.log("before unmount component of twitter bookmark review. tweets=", tweets.value)
})

function handleBrowserMsg(request: any) {
  console.log("Received message:", request);
  if (request.action != ACTION_FETCH_X_AUTH) {
    console.warn("Received unknown action:", request.action);
    return;
  }

  const buildRawHeaders: Record<string, string> = {}
  for (const header of request.headers) {
    buildRawHeaders[header.name] = header.value;
  }
  console.log("Request header for bookmark=", buildRawHeaders);
  requestBookmark(BOOKMARK_SIZE, buildRawHeaders).then((responseData) => {
    console.log("Received response:", responseData);
    tweets.value = extractEntries(responseData);
  })
}

onBeforeMount(async () => {
  console.log("before mount component of twitter bookmark review.");
  browser.runtime.onMessage.addListener(handleBrowserMsg);
  browser.runtime.sendMessage({ action: ACTION_FETCH_X_AUTH });
})

onUnmounted(() => {
  console.log("unmount component of twitter bookmark review.");
  browser.runtime.onMessage.removeListener(handleBrowserMsg);
})
</script>

<template>
  <div v-for="tweet in tweets" :key="tweet.id">
    <TweetBox :tweet="tweet"></TweetBox>
  </div>
</template>
