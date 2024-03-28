<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';

const data = ref("default");
const test = () => {
  browser.runtime.onMessage.addListener(
    async function (request) {
      const buildRawHeaders: Record<string, string> = {}
      for (const header of request) {
        buildRawHeaders[header.name] = header.value;
      }
      console.log("Received message:", request, " request header for bookmark=", buildRawHeaders);

      const params = new URLSearchParams();
      params.append('variables', '{"count":100,"includePromotedContent":true}')
      params.append('features', '{"graphql_timeline_v2_bookmark_timeline":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"communities_web_enable_tweet_community_results_fetch":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"rweb_video_timestamps_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_enhance_cards_enabled":false}')
      const url = 'https://twitter.com/i/api/graphql/uNowfj04D8HFVFMbjm6xrQ/Bookmarks?' + params.toString()
      console.log("URL:" + url)
      try {
        const response = await axios.get(url, {
          headers: buildRawHeaders
        });
        console.log(response.data);

      } catch (error) {
        console.error('请求数据时出错:', error);
      }
    }
  );

  browser.runtime.onMessage.addListener(
    function (request) {
      console.log("Received message:", request);
      if (request.x_auth !== undefined) {

        // data.value = request.x_auth
      }
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
