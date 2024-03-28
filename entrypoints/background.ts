import { Ref, ref } from "vue";
import { browser } from "wxt/browser";

export default defineBackground(() => {
  let x_auth = ref<string>();
  browser.runtime.onMessage.addListener((request, sender) => {
    console.log("Received message=", request, " from content script");
    if (!request.action) {
      console.log("Cannot read action from request.");
      return;
    }
    if (request.action == "fetch_x_auth" && sender.tab?.id !== undefined) {
      browser.tabs.sendMessage(sender.tab?.id, {x_auth: x_auth})
      console.log("send message=", x_auth.value, " to remote=", browser.runtime.id);
    }
    return true;
  })

  browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      if (details.requestHeaders == undefined || x_auth.value != undefined) {
        console.log("here");
        return;
      }

      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'authorization') {
          if (x_auth.value == undefined && details.requestHeaders[i].value) {
            console.log('Authorization Header:', details.requestHeaders[i].value);
            x_auth.value = details.requestHeaders[i].value ?? undefined;
            console.log("here");
            break;
          } else {
            console.warn('Authorization Header is empty');
          }
        }
      }
      console.log("here");
    }, {
    urls: ["*://twitter.com/i/api/*"],
  }, ["requestHeaders"])


  browser.runtime.onInstalled.addListener(async () => {
    const manifest = browser.runtime.getManifest();
    if (manifest.content_scripts === undefined) {
      return;
    }
    for (const cs of manifest.content_scripts) {
      for (const tab of await browser.tabs.query({ url: cs.matches })) {
        if (tab.id === undefined) {
          continue;
        }
        browser.scripting.executeScript({
          files: cs.js,
          target: {
            tabId: tab.id,
            allFrames: cs.all_frames
          },
          injectImmediately: cs.run_at === 'document_start'
        })
      }

    }
  })
});