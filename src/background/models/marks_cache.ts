import { FanficMark } from "../../api/models/mark";

/**
 * Модель кэша пользовательских меток
 */
export class MarksCache {
    constructor(public CacheTime: Date, public FanficMarks: FanficMark[]) { }
}
