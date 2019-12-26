export class Envelope<MessageType> {
    constructor(public Type: string, public Message: MessageType) {}
}
