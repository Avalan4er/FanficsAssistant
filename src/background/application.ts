import { IDisposable } from "rx";
import { ApiClient } from "../api/client";
import { Marks } from "../api/models/mark";
import { MarkAction } from "../messaging/mark_action_message";
import { MessageBroker } from "../messaging/message_broker";
import { MarksService } from "./marks_service";

export class Application {
    private marksService: MarksService;
    private messageBroker: MessageBroker;
    private markActionSubscription: IDisposable;

    public Start() {
        console.info("Запуск ассистента");
        this.marksService = new MarksService();
        this.messageBroker = new MessageBroker();
        this.markActionSubscription = this.messageBroker.MarkActionSubject.subscribe((message) => {
            switch (message.Action) {
                case MarkAction.Add:
                    this.AddMark(message.ExternalFanficId, message.SiteId, message.Mark);
                case MarkAction.Remove:
                    this.RemoveMark(message.ExternalFanficId, message.SiteId, message.Mark);
            }
        });
    }

    public Stop() {
        console.info("Остановка ассистента");
        this.marksService.dispose();
        this.messageBroker.dispose();
    }

    private async AddMark(externalFanficId: string, siteId: number, mark: Marks) {
        const client = new ApiClient();
        const internalFanficId = await client.GetInternalFanficId(siteId, externalFanficId);
        if (internalFanficId === -1) {
            console.warn("Не удалось добавить отметку к фанфику: фанфик не найден на fanfics.me\n"
                + "Идентификатор сайта: " + siteId + ", идентификатор фанфика: " + externalFanficId);
            return;
        }

        await client.AddMark(internalFanficId, mark);
        this.marksService.AddOrUpdateMark(internalFanficId, externalFanficId, siteId, mark);

        console.info(`Отметка ${mark} добавлена к фанфику ${internalFanficId}`);
    }

    private async RemoveMark(externalFanficId: string, siteId: number, mark: Marks) {
        const client = new ApiClient();
        const internalFanficId = await client.GetInternalFanficId(siteId, externalFanficId);
        if (internalFanficId === -1) {
            console.warn("Не удалось добавить отметку к фанфику: фанфик не найден на fanfics.me\n"
                + "Идентификатор сайта: " + siteId + ", идентификатор фанфика: " + externalFanficId);
            return;
        }

        await client.RemoveMark(internalFanficId, mark);
        this.marksService.RemoveMark(internalFanficId);

        console.info(`Отметка ${mark} удалена с фанфика ${internalFanficId}`);
    }
}
