const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

const LOG_DIR = process.env.LOG_DIR || `${__dirname}/./../../logs`;
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

module.exports = winston.createLogger({
    // level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    defaultMeta: { service: 'anacleto-backend' },
    transports: [
        new winston.transports.Console({
            //format: winston.format.simple(),
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                // Format the metadata object
                winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
            ),
        }),
        new winston.transports.DailyRotateFile({
            filename: `${LOG_DIR}/errors-%DATE%.log`,
            level: 'error',
            datePattern: 'YYYY-MM-DD_HH',
            //zippedArchive: true,
            maxSize: process.env.LOGS_MAX_SIZE || '20m',
            maxFiles: process.env.LOGS_MAX_FILE || '1d',
            handleExceptions: true
        }),
        new winston.transports.DailyRotateFile({
            filename: `${LOG_DIR}/anacleto-%DATE%.log`,
            level: process.env.ENV == 'development' ? 'verbose' : 'info',
            datePattern: 'YYYY-MM-DD_HH',
            //zippedArchive: true,
            maxSize: process.env.LOGS_MAX_SIZE || '20m',
            maxFiles: process.env.LOGS_MAX_FILE || '1d',
            handleExceptions: true
        }),
    ],
    exitOnError: false,
});