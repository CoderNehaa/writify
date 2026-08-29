import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info', // Log info and above (info, warn, error)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Output to terminal
    new winston.transports.File({ filename: 'logs/app.log' }) // Save to file
  ],
});

export default logger;
