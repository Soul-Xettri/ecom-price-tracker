const winston = require("winston");
const { format } = require("winston");
const { combine, json, prettyPrint, metadata } = format;
require("winston-mongodb").MongoDB;

const authLogger = winston.createLogger({
  format: combine(json(), prettyPrint(), metadata()),
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URL,
      collection: "logs",
      level: "info",
    }),
  ],
});

module.exports = authLogger;