<script lang="ts" setup>
import { Tweet } from "@/public/model/TweetModel";
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
  console.log("profile image load failed");
  profileImageFailed.value = true;
}

function getTimeDifference(inputDate: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - inputDate.getTime());
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours <= 24) {
    return diffHours + 'h';
  } else if (diffDays <= 3) {
    return diffDays + 'd';
  } else {
    return inputDate.getFullYear() + 'Y' + (inputDate.getMonth() + 1) + 'M' + inputDate.getDate() + 'D';
  }
}

const tweetTime = computed(() => {
  if (props.tweet.createAt == undefined) {
    return "";
  }

  let date = new Date(props.tweet.createAt);
  return getTimeDifference(date);
})

</script>

<template>
  <div class="tweet-container">
    <div class="tweet-header">
      <div id="profile-image" style="width: 40px; margin-right: 8px;">
        <img class="profile-image" :src="profileImage" alt="Profile Image" @error="onProfileX96ImageLoadFailed" />
      </div>
      <div id="usermetainfo" style="display: flex;">
        <div class="name" style="flex: 3; ">{{ tweet.user.name }}</div>
        <div class="username" style="flex: 1; margin-left: 4px;">@{{ tweet.user.screenName }}</div>
        <div class="timediff" style="flex: 1; margin-left: 4px;">{{ tweetTime }}</div>
      </div>
    </div>

    <div class="tweet-content">{{ tweet.fullText }}</div>
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.name {
  font-weight: bold;
}

.username {
  color: #657786;
}

.timediff {
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