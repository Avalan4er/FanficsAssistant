import { IDisposable, Subject } from "rx";
import { MarkActionMessage } from "./mark_action_message";

export class MessageBroker implements IDisposable {
    public MarkActionSubject: Subject<MarkActionMessage> = new Subject<MarkActionMessage>();
    private supportedMessages: { [messageType: string]: (message: any) => void } = {};

    constructor() {
        this.supportedMessages.MarkActionMessage = (message) =>
            this.MarkActionSubject.onNext(MarkActionMessage.Parse(message));

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => this.ProcessMessage(message));
    }

    public dispose() {
        console.debug("EventAggregator уничтожен");
    }

    private ProcessMessage(envelope: any) {
        console.info("Получено сообщение:\n" + envelope);

        if (!envelope.hasOwnProperty("Type") || !envelope.hasOwnProperty("Message")) {
            console.warn("не удалось опознать полученное сообщение");
            return;
        }

        const type = envelope.Type as string;
        const message = envelope.Message;

        if (!this.supportedMessages.hasOwnProperty(type)) {
            console.warn("Не удалось обработать полученное сообщение: данный тип сообщений не поддерживается");
            return;
        }

        this.supportedMessages[type](message);
        console.info("Сообщение обработано");
    }
}
