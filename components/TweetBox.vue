<script lang="ts" setup>
import { Tweet, User } from "@/public/model/TweetModel";
import { computed } from "vue";
import { ref } from "vue";

const props = defineProps<{
  tweet: Tweet;
}>();

const profileImageFailed = ref(false);

const profileImage = computed(() => {
  if (profileImageFailed.value) {
    return props.tweet.user.profileImage;
  }
  let base = props.tweet.user.profileImage.slice(0, -10); // 移除最后5个字符
  return `${base}x96.jpg`; // 添加新的后缀
});

function onProfileX96ImageLoadFailed(event: Event) {
  profileImageFailed.value = true;
}

</script>

<template>
  <div class="tweet-container">
    <div class="tweet-header">
      <img class="profile-image" :src="profileImage" alt="Profile Image" @error="onProfileX96ImageLoadFailed" />
      <div>
        <div class="name">{{ tweet.user.name }}</div>
        <div class="username">@{{ tweet.user.screenName }}</div>
      </div>
    </div>
    <div class="tweet-content">{{ tweet.fullText }}</div>
    <div class="tweet-footer">
      <span>{{ tweet.createAt }}</span>
    </div>
  </div>
</template>

<style scoped>
.tweet-container {
  border: 1px solid #e1e8ed;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
}

.tweet-header {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.name {
  font-weight: bold;
}

.username {
  color: #657786;
}

.tweet-content {
  margin-top: 10px;
}

.tweet-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #657786;
}

.interactions span {
  margin-right: 10px;
  cursor: pointer;
}
</style>