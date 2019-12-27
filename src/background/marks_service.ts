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
        const fanficMark = this.marksCache.FanficMarks.find((fm) => fm.internalFanficId === internalFanficId);
        if (fanficMark == null) {
            const newFanficMark =  new FanficMark(internalFanficId, siteId, externalFanficId, [mark]);
            this.marksCache.FanficMarks.push(newFanficMark);
        } else {
            const index = this.marksCache.FanficMarks.indexOf(fanficMark);
            fanficMark.marks.push(mark);
            this.marksCache.FanficMarks[index] = fanficMark;
        }
    }

    public RemoveMark(internalFanficId: number) {
        const fanficMark = this.marksCache.FanficMarks.find((fm) => fm.internalFanficId === internalFanficId);
        if (fanficMark !== null) {
            const index = this.marksCache.FanficMarks.indexOf(fanficMark);
            delete this.marksCache.FanficMarks[index];
        }
    }

    private async Refresh() {
        const currentTime = new Date();
        const client = new ApiClient();
        const marks = await client.GetMarks();

        this.marksCache = new MarksCache(currentTime, marks);
    }
}
