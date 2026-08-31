import winston from 'winston';
import WinstonCloudwatch from 'winston-cloudwatch';
import { AWS_REGION, NODE_ENV } from '../config/environment';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info', // Log info and above (info, warn, error)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Output to terminal
    // new winston.transports.File({ filename: 'logs/app.log' }) // Save to file
    new WinstonCloudwatch({
      logGroupName: "writify-server-logs",
      logStreamName: `server-${NODE_ENV}`,
      awsRegion: AWS_REGION,

      jsonMessage: true
    })
  ],
});

export default logger;
