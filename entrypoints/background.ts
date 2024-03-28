import { Ref, ref } from "vue";
import { browser } from "wxt/browser";

function handleFetchXAuth(x_auth: Ref<string | undefined>, sender) {
  browser.runtime.sendMessage(sender.tab.id, { x_auth: x_auth })
  console.log("send message to remote", x_auth.value);
}

export default defineBackground(() => {
  let x_auth = ref<string>();
  browser.runtime.onMessage.addListener((request, sender) => {
    console.log("Received message=", request, " from content script");
    if (!request.action) {
      console.log("Cannot read action from request.");
      return;
    }
    if (request.action == "fetch_x_auth") {
      console.log("sender=", sender);
      handleFetchXAuth(x_auth, sender);
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
});