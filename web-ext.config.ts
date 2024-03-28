import { defineRunnerConfig } from 'wxt';

export default defineRunnerConfig({
  binaries: {
    edge: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', // Open MS Edge when running "wxt -b edge"
  },
  startUrls: ["https://twitter.com/home"],
  chromiumArgs: ["--keep-profile-changes", "--user-data-dir=./debug/edgeprofile"]
});
