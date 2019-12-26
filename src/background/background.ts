import { Application } from "./application";

const app = new Application();

chrome.runtime.onStartup.addListener(() => {
    app.Start();
});

chrome.runtime.onSuspend.addListener(() => {
    app.Stop();
});
