const winston = require('winston');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

// https://www.npmjs.com/package/winston#further-reading
//
// In order to use this same logger configuration across
// multiple modules we need to create a 'default logger'.
// Once this is created then any modules that require
// winston will automatically use this configuration.

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

winston.configure({
  format: combine(
    timestamp(),
    myFormat()
  ),
  transports: [
    new winston.transports.File({ filename: 'cata.log' })
  ]
});