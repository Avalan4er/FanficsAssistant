import { IDisposable, Observable } from "rx";
import { ApiClient } from "../api/client";
import { FanficMark, Marks } from "../api/models/mark";
import { CACHE_REFRESH_PERIOD } from "./constants";
import { MarksCache } from "./models/marks_cache";

export class MarksService implements IDisposable {

    private cacheRefreshSubscription: IDisposable;
    private marksCache: MarksCache;

    constructor() {
        this.cacheRefreshSubscription = Observable
            .timer(0, CACHE_REFRESH_PERIOD)
            .subscribe(() => this.Refresh());
    }

    public dispose() {
        this.cacheRefreshSubscription.dispose();
    }

    public AddOrUpdateMark(internalFanficId: number, externalFanficId: string, siteId: number, mark: Marks) {
        console.info(`Сохраняю метку ${mark} к фанфику ${internalFanficId}`);
        const fanficMark = this.marksCache.FanficMarks.find((fm) => fm.internalFanficId === internalFanficId);
        if (fanficMark == null) {
            const newFanficMark =  new FanficMark(internalFanficId, siteId, externalFanficId, [mark]);
            this.marksCache.FanficMarks.push(newFanficMark);
        } else {
            const index = this.marksCache.FanficMarks.indexOf(fanficMark);
            fanficMark.marks.push(mark);
            this.marksCache.FanficMarks[index] = fanficMark;
        }
        console.info(`Метка ${mark} добавлена к фанфику ${internalFanficId}`);
    }

    public RemoveMark(internalFanficId: number, mark: Marks) {
        console.info(`Удаляю метки фанфика ${internalFanficId}`)
        const fanficMark = this.marksCache.FanficMarks.find((fm) => fm.internalFanficId === internalFanficId);
        if (fanficMark === null) {
            console.warn(`Не удалось удалить метку ${mark} фанфика ${internalFanficId}: фанфик не добавлен в кэш`);
            return;
        }

        if (fanficMark !== null) {
            const markIndex = fanficMark.marks.indexOf(mark);
            if (markIndex === -1) {
                console.warn(`Не удалось удалить метку ${mark} фанфика ${internalFanficId}: метка не найдена`);
                return;
            }
            delete fanficMark.marks[markIndex];
        }
    }

    private async Refresh() {
        console.info("Выполняю обновление кэша");
        const currentTime = new Date();
        const client = new ApiClient();
        const marks = await client.GetMarks();

        this.marksCache = new MarksCache(currentTime, marks);
        console.info("Кэш обновлен");
    }
}
