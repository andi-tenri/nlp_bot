const { createLogger, format, transports } = require('winston');
const { printf, combine, timestamp } = format;

const loggerFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        loggerFormat
    ),
    transports: [
        new transports.File({ filename: './logs/error.log', level: 'error' })
    ]
});

module.exports = logger