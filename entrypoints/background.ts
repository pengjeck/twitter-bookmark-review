import { Ref, ref } from "vue";
import { browser } from "wxt/browser";

export default defineBackground(() => {
  let x_auth = ref<string>();
  browser.runtime.onMessage.addListener((request, sender) => {
    if (sender.tab?.id === undefined) {
      console.log("sender tab id not exist, ignore this message.");
      return;
    }

    console.log("Received message=", request, " from content script");
    if (!request.action) {
      console.log("Cannot read action from request.");
      return;
    }

    if (request.action == "fetch_x_auth") {
      browser.tabs.sendMessage(sender.tab?.id, {x_auth: x_auth})
      console.log("send message=", x_auth.value, " to remote=", browser.runtime.id);
    }
    return true;
  })

  browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      if (details.requestHeaders == undefined) {
        console.log("request header is empty. cannot fetch authorization message from header");
        return;
      }

      if (x_auth.value !== undefined) {
        console.log("x_auth already has a value, so it won't be reassigned.")
        return;
      }

      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'authorization') {
          if (x_auth.value == undefined && details.requestHeaders[i].value) {
            console.log('Authorization Header:', details.requestHeaders[i].value, " assign to x_auth");
            x_auth.value = details.requestHeaders[i].value ?? undefined;
            break;
          } else {
            console.warn('Authorization Header is empty');
          }
        }
      }
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