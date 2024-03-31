<script lang="ts" setup>
import axios, { HttpStatusCode } from 'axios';
import { ref } from 'vue';
import TweetBox from './TweetBox.vue'
import { onBeforeMount } from 'vue';
import { onUnmounted } from 'vue';
import { extractEntries } from '@/public/bookmark';
import { Tweet } from '@/public/model/TweetModel';

const ACTION_FETCH_X_AUTH = "fetch_x_auth";
const BOOKMARK_SIZE = 1;

async function requestBookmark(bookmarkSize: number, headers: object): Promise<object> {
  const params = new URLSearchParams();
  params.append('variables', '{"count":' + bookmarkSize + ',"includePromotedContent":false}')
  params.append('features', '{"graphql_timeline_v2_bookmark_timeline":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"communities_web_enable_tweet_community_results_fetch":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"rweb_video_timestamps_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_enhance_cards_enabled":false}')
  const url = 'https://twitter.com/i/api/graphql/uNowfj04D8HFVFMbjm6xrQ/Bookmarks?' + params.toString()
  console.log("request bookmark :" + url)
  try {
    const response = await axios.get(url, {
      headers: headers
    });
    if (response.status != HttpStatusCode.Ok) {
      return {}
    }
    return response.data;
  } catch (error) {
    console.error('请求数据时出错:', error);
    return {}
  }
}

let tweets = ref(Array<Tweet>());

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
  browser.runtime.onMessage.addListener(handleBrowserMsg);
  browser.runtime.sendMessage({ action: ACTION_FETCH_X_AUTH });
})

onUnmounted(() => {
  console.log("unmount component of twitter bookmark review.");
  browser.runtime.onMessage.removeListener(handleBrowserMsg);
})
</script>

<template>
  <button>1233</button>
  <div v-for="tweet in tweets" :key="tweet.id">
    <TweetBox :tweet="tweet"></TweetBox>
  </div>
</template>

<style scoped>
</style>