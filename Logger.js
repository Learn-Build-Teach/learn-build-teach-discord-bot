const winston = require('winston');
const { format, transports } = require('winston');
require('winston-daily-rotate-file');

const errorTransport = new transports.DailyRotateFile({
    filename: `${__dirname}/logs/error.log`,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '10m',
    maxFiles: '10d',
    level: 'error',
});

const infoTransport = new transports.DailyRotateFile({
    filename: `${__dirname}/logs/info.log`,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '10k',
    maxFiles: '10d',
    level: 'info',
});

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(
            (info) =>
                `${info.timestamp}: ${info.level}: ${info.message}` +
                (info.splat !== undefined ? `${info.splat}` : ' ')
        )
    ),
    transports: [
        errorTransport,
        infoTransport,
        new winston.transports.Console(),
    ],
});

module.exports = logger;
