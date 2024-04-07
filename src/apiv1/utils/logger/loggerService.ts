import { Format } from 'logform';
import { Options } from 'morgan';
import { Service, Container } from 'typedi';
import * as winston from 'winston';
import * as path from 'path';
import * as httpContext from 'express-http-context';
import DailyRotateFile from 'winston-daily-rotate-file';
// import WinstonTelegram from 'winston-telegram';
import { TelegramLogger } from './TelegramLogger';

const tg = new TelegramLogger('7158590156:AAGUTTwF3CQQ55xUITpQHYiysozBbolOsPM', '-4151018983');
export function Logger(fileName: string) {
  return function (object: any, propertyName: string, index?: number) {
    const logger = new LoggerService(fileName);
    Container.registerHandler({ object, propertyName, index, value: () => logger });
  };
}

@Service()
export class LoggerService {
  private telegramLogger: any
  private logger: winston.Logger;
  private loggerHTTP: winston.Logger;

  constructor(private fileName: string) {
    this.setupLogger();
    this.setupConsoleStream();
    this.telegramLogger = tg.setWinstonTransporter(tg)
  }

  public getLogger(): winston.Logger {
    return this.logger;
  }

  public getHTTPLogger(): winston.Logger {
    return this.loggerHTTP;
  }

  private getFileLogFormat(): Format {
    const addContext = winston.format(info => {
      const reqID = this.getRequestUUID();
      if (reqID) {
        info.requestID = reqID;
      }
      const origin = this.getOrigin();
      info.from = origin;
      return info;
    });
    return winston.format.combine(
      winston.format.uncolorize(),
      winston.format.timestamp(),
      addContext(),
      winston.format.json()
    );
  }

  private getConsoleLogFormat(): Format {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf((info) => {
        const {
          timestamp, level, message, ...args
        } = info;
        const ts = timestamp.slice(0, 19).replace('T', ' ');
        const format = `${ts} | ${level} | ${this.getOrigin()}` +
          `${this.getRequestUUID() ? ` | ${this.getRequestUUID()} ` : ''} »` +
          ` ${message.replace('\t', '')} ${Object.keys(args).length ? ('\n' + JSON.stringify(args, null, 2)) : ''}`;
        return format;
      })
    );
  }

  private setupLogger() {
    if (process.env.NODE_ENV === 'production') {
      // setup transports
      const transportError = new DailyRotateFile({
        level: 'error',
        filename: path.join(__dirname, `../../logs/error-%DATE%.log`),
        format: this.getFileLogFormat(),
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '31d'
      });

      const transportCombined = new DailyRotateFile({
        level: 'info',
        filename: path.join(__dirname, `../../logs/combined-%DATE%.log`),
        format: this.getFileLogFormat(),
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '31d'
      });
      const transportHTTP = new DailyRotateFile({
        format: winston.format.combine(
          winston.format.uncolorize(),
          winston.format.printf((info) => {
            const message = info.message;
            return message;
          })
        ),
        filename: path.join(__dirname, `../../logs/http-%DATE%.log`),
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '31d'
      });
      this.logger = winston.createLogger({
        level: 'info',
        transports: [transportError, transportCombined]
      });
      this.loggerHTTP = winston.createLogger({
        level: 'http',
        levels: {
          http: 1
        },
        transports: [transportHTTP]
      });
    } else {
      this.logger = winston.createLogger({ level: 'info' });
      this.loggerHTTP = winston.createLogger({ level: 'http' });
    }
  }

  private getOrigin(): string {
    let origin = this.fileName || 'dev';
    if (this.fileName) {
      origin = origin.replace(process.cwd(), '');
      origin = origin.replace(`${path.sep}src${path.sep}`, '');
      origin = origin.replace(`${path.sep}dist${path.sep}`, '');
      origin = origin.replace(/([.]ts)|([.]js)/, '');
    }
    return origin;
  }

  private getRequestUUID(): string {
    const reqId = httpContext.get('reqId');
    return reqId;
  }

  private setupConsoleStream() {
    this.logger.add(tg.setWinstonTransporter(tg))
    this.logger.add(new winston.transports.Console({ format: this.getConsoleLogFormat() }));
    this.loggerHTTP.add(new winston.transports.Console({ format: this.getConsoleLogFormat() }));
  }

  log(level: string, message: string): void {
    this.getLogger().log(level, message);
  }

  error(message: string, args?: any): void {
    this.getLogger().error(message, args);
  }

  warn(message: string, args?: any): void {
    this.getLogger().warn(message, args);
  }

  verbose(message: string, args?: any): void {
    this.getLogger().verbose(message, args);
  }

  info(message: string, args?: any): void {
    this.getLogger().info(message, args);
  }

  debug(message: string, args?: any): void {
    this.getLogger().debug(message, args);
  }

  silly(message: string, args?: any): void {
    this.getLogger().silly(message, args);
  }

  telegramLog(info: object, callback: () => any) {
    this.telegramLogger.log(info, callback)
  }
}

export const morganOption: Options<any, any> = {
  stream: {
    write: (message: string) => {
      const logger = Container.get(LoggerService);
      logger.getHTTPLogger().log('http', message.replace('\n', ''));
    }
  }
};