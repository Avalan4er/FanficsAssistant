export enum Marks {
    /** Подписка */
    Subscription = 1,
    /** Прочитано */
    Read = 3,
    /** Не читать */
    DoNotRead = 4,
    /** Прочитать позже */
    ReadLater = 5,
    /** Жду окончания */
    WaitTheEnd = 6,
    /** Понравилось */
    Like = 7,
    /** Не понравилось */
    Dislike = 8,
    /** Скачано */
    Donwload = 9,
}

export class FanficMark {
    /**
     * Информация о метках фанфика
     * @param internalFanficId Идентификатор фанфика на сайте fanfics.me
     * @param siteId Идентификатор сайта
     * @param externalFanficId Идентификатор фанфика на исходном сайте
     * @param marks Метки фанфика
     */
    constructor(
        public internalFanficId: number,
        public siteId: number,
        public externalFanficId: string,
        public marks: Marks[]) {
    }
}
