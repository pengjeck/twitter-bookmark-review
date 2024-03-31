import { Tweet, User } from "@/public/model/TweetModel";
import axios, { HttpStatusCode } from "axios";

function extractUserInfo(entry: {[key: string]: any}) : User | undefined {
  const user: User = {
    name: "",
    screenName: "",
    profileImage: ""
  }
  try {
    user.name = entry["content"]["itemContent"]["tweet_results"]["result"]["core"]["user_results"]["result"]["legacy"]["name"];
    user.screenName = entry["content"]["itemContent"]["tweet_results"]["result"]["core"]["user_results"]["result"]["legacy"]["screen_name"];
    user.profileImage = entry["content"]["itemContent"]["tweet_results"]["result"]["core"]["user_results"]["result"]["legacy"]["profile_image_url_https"];
  } catch (error) {
    console.log("meet error when extract user info from bookmark entry", error)
    return undefined;
  }
  
  return user;
}

function extractTweetInfo(entry: {[key: string]: any}) : Tweet | undefined {
  if (entry["content"]["entryType"] != "TimelineTimelineItem") {
    console.log("entry=", entry["entryId"], " is not TimelineTimelineItem")
    return undefined;
  }

  const user = extractUserInfo(entry);
  if (user == undefined) {
    console.log("meet error when extract user info from bookmark entry")
    return undefined;
  }

  const tweet: Tweet = {
    user: user,
    id: "",
    fullText: "",
    createAt: ""
  }
  try {
    tweet.id = entry["content"]["itemContent"]["tweet_results"]["result"]["legacy"]["id_str"];
    tweet.fullText = entry["content"]["itemContent"]["tweet_results"]["result"]["legacy"]["full_text"];
    tweet.createAt = entry["content"]["itemContent"]["tweet_results"]["result"]["legacy"]["created_at"];
  } catch (error) {
    console.log("meet error when extract tweet info from bookmark entry", error)
    return undefined;
  }
  return tweet;
}

export function extractEntries(bookmarks: {[key: string]: any}) : Array<Tweet> {
  const posts: Tweet[] = []
  try {
    const instructions = bookmarks["data"]["bookmark_timeline_v2"]["timeline"]["instructions"];
    if (!(instructions instanceof Array)) {
      console.log("instructions in bookmarks is not array")
      return posts;
    }
    const timelineEntries = instructions.findLast(instruction => {
      if (instruction["type"] == "TimelineAddEntries") {
        console.log("instruction is not TimelineAddEntries")
        return true;
      }
    })
    console.log(timelineEntries["entries"])
    for (const entry of timelineEntries["entries"]) {
      const newTweet = extractTweetInfo(entry);
      if (newTweet == undefined) {
        console.log("meet error when extract tweet info from bookmark entry")
        continue;
      }
      posts.push(newTweet);
    }
    console.log("posts", posts)
    return posts;
  } catch (error) {
    console.log("meet error when handle rearrange bookmark")
    return posts;
  }
}

export async function requestBookmark(bookmarkSize: number, headers: object): Promise<object> {
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