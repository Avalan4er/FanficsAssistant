import { Marks } from "../api/models/mark";

export enum MarkAction {
    Add = 1,
    Remove = 2,
}

export class MarkActionMessage {

    public static Parse(data: any): MarkActionMessage {
        const keys = Object.keys(data);

        if (    !data.hasOwnProperty("Action")
            ||  !data.hasOwnProperty("SiteId")
            ||  !data.hasOwnProperty("ExternalFanficId")
            ||  !data.hasOwnProperty("Mark")) {
            return null;
        }

        const action = Number.parseInt(data.Action, 10) as MarkAction;
        const externalFanficId = data.ExternalFanficId as string;
        const siteId = Number.parseInt(data.SiteId, 10);
        const mark = Number.parseInt(data.Mark, 10) as Marks;

        return new MarkActionMessage(action, externalFanficId, siteId, mark);
    }

    constructor(
        public Action: MarkAction,
        public ExternalFanficId: string,
        public SiteId: number,
        public Mark: Marks) {}
}
