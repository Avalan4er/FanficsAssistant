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
        public marks: number[]) {

    }
}
