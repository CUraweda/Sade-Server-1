const winston = require("winston")
const DailyRotateFile = require("winston-daily-rotate-file")
const config = require('./config');


const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    colorize(),
    printf(({ level, message, timestamp, stack }) => {
        return stack
            ? `${timestamp} ${level}: ${message} - ${stack}`
            : `${timestamp} ${level}: ${message}`;
    })
);

const logger = winston.createLogger({
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
        new DailyRotateFile({
            filename: config.logConfig.logFolder + config.logConfig.logFile,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '3',
            prepend: true,
        }),
    ],
});

module.exports = logger;
