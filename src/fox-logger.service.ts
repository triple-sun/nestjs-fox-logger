import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { FOXLOGGER_SERVICE_OPTIONS } from './fox-logger.const';
import { FoxLoggerServiceOptions } from './fox-logger.interfaces';

@Injectable()
export class FoxLoggerService extends Logger {
  private readonly $name?: string;

  constructor(
    @Inject(FOXLOGGER_SERVICE_OPTIONS)
    readonly options: FoxLoggerServiceOptions,
    private readonly cls?: ClsService,
  ) {
    super();
    this.$name = options.name;
  }

  /**
   * Вынимаем данные из разных объектов ошибок
   * и не только, со статусом и пр.
   */
  static FormatObjectMessage(msg: object) {
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
  static FormatMessage(msg: unknown) {
    /** делаем сообщение из разных типов данных */
    switch (typeof msg) {
      case 'object':
        if (Array.isArray(msg)) {
          return msg.map(this.FormatObjectMessage).join(`\n`);
        }
        return this.FormatObjectMessage(msg);
      default:
        return String(msg);
    }
  }

  /** Задаем префикс на базе имени, cls и возможного id */
  private getPrefix(eventId?: string) {
    return (
      `${this.$name ? `[${this.$name}]` : ``}` +
      `${this.cls.getId() ? `[${this.cls.getId()}]` : ''}` +
      `${eventId ? `[${eventId}]` : ``}`
    );
  }

  public log(msg: any, eventId?: string) {
    return Logger.log(
      `${this.getPrefix(eventId)}: ${FoxLoggerService.FormatMessage(msg)}`,
    );
  }
  public warn(msg: any, eventId?: string) {
    return Logger.warn(
      `${this.getPrefix(eventId)}: ${FoxLoggerService.FormatMessage(msg)}`,
    );
  }
  public debug(msg: any, eventId?: string) {
    return Logger.debug(
      `${this.getPrefix(eventId)}: ${FoxLoggerService.FormatMessage(msg)}`,
    );
  }
  public error(msg: any, eventId?: string) {
    return Logger.error(
      `${this.getPrefix(eventId)}: ${FoxLoggerService.FormatMessage(msg)}`,
    );
  }
  public verbose(msg: any, eventId?: string) {
    return Logger.verbose(
      `${this.getPrefix(eventId)}: ${FoxLoggerService.FormatMessage(msg)}`,
    );
  }
  public fatal(msg: any, eventId?: string) {
    return Logger.fatal(
      `${this.getPrefix(eventId)}: ${FoxLoggerService.FormatMessage(msg)}`,
    );
  }
}
