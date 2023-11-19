const Pepesan = require('pepesan');
const router = require('./router');

global.__basedir = __dirname;

const { ALLOWED_NUMBERS, BLOCKED_NUMBERS, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const config = {
    browserName: "NLP-BOT",
    printQRInTerminal: true,
    sessionPath: `${__basedir}/session`,
    allowedNumbers: ALLOWED_NUMBERS ? ALLOWED_NUMBERS.split(",") : undefined,
    blockedNumbers: BLOCKED_NUMBERS ? BLOCKED_NUMBERS.split(",") : undefined,
    db: {
        host: DB_HOST,
        user: DB_USER,
        pass: DB_PASSWORD,
        name: DB_NAME,
        port: DB_PORT,
        timezone: "+00:00",
        dialect: 'mysql'
    },
    enableHttpServer: false,
    stateType: 'file',
    readBeforeReply: true,
    typingBeforeReply: true,
    reusableMenu: false,
}

const app = Pepesan.init(router, config)

module.exports = app