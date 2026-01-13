import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { FOXLOGGER_SERVICE_OPTIONS } from './fox-logger.const';
import { FoxLoggerServiceOptions } from './fox-logger.interfaces';

@Injectable()
export class FoxLoggerService extends Logger {
  private readonly $name?: string;

  private readonly cls?: ClsService;
  private readonly formatter: (msg: unknown) => string;
  private readonly prefixer: (eventId: string, ...args: unknown[]) => string;

  constructor(
    @Inject(FOXLOGGER_SERVICE_OPTIONS)
    readonly options: FoxLoggerServiceOptions,
  ) {
    super();
    this.$name = options.name;
    this.cls = options.cls;
    this.formatter = options.formatter || this.defaultFormatter;
    this.prefixer = options.prefixer || this.defaultPrefixer;
  }

  public log(msg: unknown, eventId?: string) {
    return Logger.log(`${this.prefixer(eventId)}: ${this.formatter(msg)}`);
  }
  public warn(msg: unknown, eventId?: string) {
    return Logger.warn(`${this.prefixer(eventId)}: ${this.formatter(msg)}`);
  }
  public debug(msg: unknown, eventId?: string) {
    return Logger.debug(`${this.prefixer(eventId)}: ${this.formatter(msg)}`);
  }
  public error(msg: unknown, eventId?: string) {
    return Logger.error(`${this.prefixer(eventId)}: ${this.formatter(msg)}`);
  }
  public verbose(msg: unknown, eventId?: string) {
    return Logger.verbose(`${this.prefixer(eventId)}: ${this.formatter(msg)}`);
  }
  public fatal(msg: unknown, eventId?: string) {
    return Logger.fatal(`${this.prefixer(eventId)}: ${this.formatter(msg)}`);
  }

  /**
   * Вынимаем данные из разных объектов ошибок
   * и не только, со статусом и пр.
   */
  private defaultFormatObjectMsg(msg: object) {
    const prefix = [
      'statusCode' in msg && `[${msg.statusCode}]`,
      'status' in msg && `[${msg.status}]`,
      'error' in msg && `[${msg.error}]`,
    ].filter(Boolean);
    if (prefix.length > 0) prefix.push(': ');
    const message = [
      msg['response']?.['data']?.['message'] && `: ${msg['data']['message']}`,
      msg['data']?.['message'] && `: ${msg['data']['message']}`,
      msg['message'] && `${msg['message']}`,
      msg['msg'] && `${msg['msg']}`,
    ].filter(Boolean);
    /** Если есть, что отдавать - пишем */
    if (prefix.length + message.length > 0) {
      return prefix.join(``) + message.join(' ');
    }
    return JSON.stringify(msg);
  }

  /** Получение сообщения из разных видов данных  */
  private defaultFormatter(msg: unknown) {
    /** делаем сообщение из разных типов данных */
    switch (typeof msg) {
      case 'object':
        if (Array.isArray(msg)) {
          return msg.map(this.defaultFormatObjectMsg).join(`\n`);
        }
        return this.defaultFormatObjectMsg(msg);
      default:
        return String(msg);
    }
  }

  /** Задаем префикс на базе имени, cls и возможного id */
  public defaultPrefixer(eventId?: string) {
    return (
      `${this.$name ? `[${this.$name}]` : ``}` +
      `${this.cls?.getId() ? `[${this.cls?.getId()}]` : ''}` +
      `${eventId ? `[${eventId}]` : ``}`
    );
  }
}
