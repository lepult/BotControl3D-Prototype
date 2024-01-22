export class BadResponseCodeError extends Error {
    status;

    constructor(status: number) {
        super();
        this.message = `bad response code: ${status}`;
        this.status = status;
    }
}
