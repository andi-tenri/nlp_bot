module.exports = class ResponseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ResponseError';
    }
}