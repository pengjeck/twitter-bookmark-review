// import Tweet from './Tweet.vue'
import { Tweet, User } from "@/public/model/TweetModel";

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

