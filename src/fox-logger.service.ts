import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { FOXLOGGER_SERVICE_OPTIONS } from './fox-logger.const';
import { FoxLoggerServiceOptions } from './fox-logger.interfaces';

@Injectable()
export class FoxLoggerService extends Logger {
  private readonly name?: string;

  constructor(
    @Inject(FOXLOGGER_SERVICE_OPTIONS)
    readonly options: FoxLoggerServiceOptions,
    private readonly cls?: ClsService,
  ) {
    super();
    this.name = options.name;
  }

  /** Получение разных  */
  private formatMsg(msg: unknown) {
    /** делаем сообщение из разных типов данных */
    switch (typeof msg) {
      case 'string':
        return msg;
      case 'number':
      case 'bigint':
      case 'boolean':
      case 'symbol':
      case 'undefined':
      case 'function':
        return String(msg);
      case 'object':
        /**
         * Вынимаем данные из разных объектов ошибок
         * и не только, со статусом и пр.
         */
        const prefix = [
          'statusCode' in msg && `[${msg.statusCode}]`,
          'status' in msg && `[${msg.status}]`,
          'error' in msg && `[${msg.error}]`,
        ].filter(Boolean);
        if (prefix.length > 0) prefix.push(': ');
        const message = [
          msg['response']?.['data']?.['message'] &&
            `: ${msg['data']['message']}`,
          msg['data']?.['message'] && `: ${msg['data']['message']}`,
          msg['message'] && `${msg['message']}`,
          msg['msg'] && `${msg['msg']}`,
        ].filter(Boolean);
        /** Если есть, что отдавать - пишем-с */
        if (prefix.length + message.length > 0) {
          return prefix.join(``) + message.join(' ');
        }
      /** В противном случае */
      default:
        JSON.stringify(msg);
    }
  }

  /** Задаем префикс на базе имени, cls и возможного id */
  private getPrefix(eventId?: string) {
    return (
      `${this.name ? `[${this.name}]` : ``}` +
      `${this.cls.getId() ? `[${this.cls.getId()}]` : ''}` +
      `${eventId ? `[${eventId}]` : ``}`
    );
  }

  public log(msg: any, eventId?: string) {
    return Logger.log(this.getPrefix(eventId) + `: ` + this.formatMsg(msg));
  }
  public warn(msg: any, eventId?: string) {
    return Logger.warn(this.getPrefix(eventId) + `: ` + this.formatMsg(msg));
  }
  public debug(msg: any, eventId?: string) {
    return Logger.debug(this.getPrefix(eventId) + `: ` + this.formatMsg(msg));
  }
  public error(msg: any, eventId?: string) {
    return Logger.error(this.getPrefix(eventId) + `: ` + this.formatMsg(msg));
  }
  public verbose(msg: any, eventId?: string) {
    return Logger.verbose(this.getPrefix(eventId) + `: ` + this.formatMsg(msg));
  }
  public fatal(msg: any, eventId?: string) {
    return Logger.fatal(this.getPrefix(eventId) + `: ` + this.formatMsg(msg));
  }
}
