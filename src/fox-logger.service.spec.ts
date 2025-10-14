import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ClsModule, ClsService } from 'nestjs-cls';

import { FoxLoggerModule } from './fox-logger.module';
import { FoxLoggerService } from './fox-logger.service';

describe('FoxLoggerService', () => {
  let cls: DeepMockProxy<ClsService>;
  let service: FoxLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModule.forRoot({
          global: true,
        }),
        FoxLoggerModule.forFeature({
          name: 'TEST',
        }),
      ],
      providers: [FoxLoggerService, ClsService],
    })
      .overrideProvider(ClsService)
      .useValue(mockDeep(ClsService))
      .compile();

    service = module.get(FoxLoggerService);
    cls = module.get(ClsService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('.log', () => {
    beforeEach(async () => {
      jest.spyOn(Logger, 'log');
      cls.getId.mockReturnValue('testLogId');
    });

    it('should call Logger.log', async () => {
      service.log('test');
      expect(Logger.log).toHaveBeenCalledTimes(1);
    });

    it('should call cls.getId()', async () => {
      expect(cls.getId).toHaveBeenCalledTimes(2);
    });

    it('should call Logger.log with correct message', () => {
      expect(Logger.log).toHaveBeenCalledWith(`[TEST][testLogId]: test`);
    });
  });

  describe('.warn', () => {
    beforeEach(() => {
      jest.spyOn(Logger, 'warn');
      cls.getId.mockReturnValue('testWarnId');
    });

    it('should call Logger.warn', async () => {
      service.warn('test');
      expect(Logger.warn).toHaveBeenCalledTimes(1);
    });

    it('should call cls.getId()', async () => {
      expect(cls.getId).toHaveBeenCalledTimes(4);
    });

    it('should call Logger.warn with correct message', () => {
      expect(Logger.warn).toHaveBeenCalledWith(`[TEST][testWarnId]: test`);
    });
  });

  describe('.error', () => {
    beforeEach(async () => {
      jest.spyOn(Logger, 'error');
      cls.getId.mockReturnValue('testErrId');
    });

    it('should call Logger.error', async () => {
      service.error('error');
      expect(Logger.error).toHaveBeenCalledTimes(1);
    });

    it('should call cls.getId()', async () => {
      expect(cls.getId).toHaveBeenCalledWith();
    });

    it('should call Logger.warn with correct message', () => {
      expect(Logger.error).toHaveBeenCalledWith(`[TEST][testErrId]: error`);
    });
  });

  describe('.error (object)', () => {
    beforeEach(async () => {
      jest.spyOn(Logger, 'error');
    });

    it('should call Logger.error', async () => {
      cls.getId.mockReturnValue('testErrId');

      service.error({ message: `error!`, statusCode: 500 });
      expect(Logger.error).toHaveBeenCalledTimes(2);
    });

    it('should call cls.getId()', async () => {
      expect(cls.getId).toHaveBeenCalledTimes(8);
    });

    it('should call Logger.warn with correct message', () => {
      expect(Logger.error).toHaveBeenCalledWith(
        `[TEST][testErrId]: [500]: error!`,
      );
    });
  });

  describe('.verbose', () => {
    beforeEach(() => {
      jest.spyOn(Logger, 'verbose');
    });

    it('should call Logger.verbose', async () => {
      cls.getId.mockReturnValue('testVerboseId');

      service.verbose('verbose');
      expect(Logger.verbose).toHaveBeenCalledTimes(1);
    });

    it('should call cls.getId()', async () => {
      expect(cls.getId).toHaveBeenCalledTimes(10);
    });

    it('should call Logger.verbose with correct message', () => {
      expect(Logger.verbose).toHaveBeenCalledWith(
        `[TEST][testVerboseId]: verbose`,
      );
    });
  });

  describe('.fatal', () => {
    beforeEach(() => {
      jest.spyOn(Logger, 'fatal');
    });

    it('should call Logger.fatal', async () => {
      cls.getId.mockReturnValue('testFatalId');

      service.fatal('fatal');
      expect(Logger.fatal).toHaveBeenCalledTimes(1);
    });

    it('should call cls.getId()', async () => {
      expect(cls.getId).toHaveBeenCalledTimes(12);
    });

    it('should call Logger.verbose with correct message', () => {
      expect(Logger.fatal).toHaveBeenCalledWith(`[TEST][testFatalId]: fatal`);
    });
  });
});
