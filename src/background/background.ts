import { Application } from "./application";

const app = new Application();
app.Start();

chrome.runtime.onSuspend.addListener(() => {
    app.Stop();
});
