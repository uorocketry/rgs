import winston from "winston";

export function loggerFactory(service: string) {
  return winston.createLogger({
    level: "silly",
    defaultMeta: { service },
    format: winston.format.combine(
      winston.format.timestamp({ format: "h:mm:ss A" })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.printf(
            (info) => `${info.timestamp} [${info.service}] ${info.message}`
          )
        ),
      }),
    ],
  });
}
