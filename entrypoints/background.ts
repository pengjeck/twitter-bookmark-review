import { Ref, ref } from "vue";
import { browser } from "wxt/browser";
import { Runtime } from "wxt/browser";

function sendMessageToRemote(message: any, sender: Runtime.MessageSender) {
  if (sender.tab?.id !== undefined) {
    browser.tabs.sendMessage(sender.tab?.id, message);
    return;
  }

  // 截取sender.url前缀，判断是否是本扩展的content script
  if (sender?.url?.substring(0, 19) === "chrome-extension://") {
    browser.runtime.sendMessage(browser.runtime.id, message);
    return;
  }
}

export default defineBackground(() => {
  let x_auth_context = ref<{}>();

  browser.runtime.onMessage.addListener((request, sender) => {    
    console.log("Received message=", request, " from content script");
    if (!request.action) {
      console.log("Cannot read action from request.");
      return;
    }

    if (request.action == "fetch_x_auth") {
      if (x_auth_context !== undefined) {
        sendMessageToRemote({action: request.action, headers: x_auth_context.value}, sender);
        console.log("Send message=", x_auth_context.value, " to remote=", sender.url);
      } else {
        console.log("x_auth was unexpectedly not assigned a value.");
      }
    }
    return true;
  })

  browser.webRequest.onSendHeaders.addListener(
    (details) => {
      if (details.requestHeaders == undefined) {
        console.log("request header is empty. cannot fetch authorization message from header");
        return;
      }

      if (x_auth_context.value !== undefined) {
        console.log("x_auth already has a value, so it won't be reassigned.")
        return;
      }
      console.log("request detail=", details)
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'Cookie') {
          console.log('Authorization Header:', details.requestHeaders, " assign to x_auth");
          x_auth_context.value = details.requestHeaders
          return;
        }
      }
    }, {
    urls: ["*://twitter.com/i/api/*"],
  }, ["requestHeaders", "extraHeaders"])


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