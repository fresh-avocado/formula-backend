import winston from 'winston';

const SEP = 'π';
const DATE_FORMAT = 'MM-DD-YYYY HH:mm:ss.SSS';

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    json: 3,
    info: 4,
    request: 5,
    response: 6,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    json: 'grey',
    info: 'green',
    request: 'cyan',
    response: 'magenta',
  },
};

winston.addColors(config.colors);

const logger: winston.Logger = winston.createLogger({
  levels: config.levels,
  format:
    process.env.NODE_ENV === 'production'
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.metadata(),
          winston.format.printf((info) => `${info.metadata.module}${SEP}${info.timestamp}${SEP}${info.message}`),
        )
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.metadata(),
          winston.format.timestamp({ format: DATE_FORMAT }),
          winston.format.printf((info) => `${info.timestamp} (${info.metadata.module}) ${info.level} => ${info.message}`),
        ),
  transports:
    process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/info.log',
            level: 'info',
          }),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/warn.log',
            level: 'warn',
          }),
        ]
      : [new winston.transports.Console()],
  level: 'response',
});

export default logger;
