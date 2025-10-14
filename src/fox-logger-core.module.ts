import {
  DynamicModule,
  Global,
  Module,
  Provider,
  ValueProvider,
} from '@nestjs/common';

import { FOXLOGGER_SERVICE_OPTIONS } from './fox-logger.const';
import {
  FoxLoggerServiceAsyncOptions,
  FoxLoggerServiceOptions,
  FoxLoggerServiceOptionsFactory,
} from './fox-logger.interfaces';
import { FoxLoggerService } from './fox-logger.service';

@Global()
@Module({})
export class FoxLoggerCoreModule {
  /** */
  public static forRoot(options: FoxLoggerServiceOptions): DynamicModule {
    const LoopModuleOptionsProvider: ValueProvider<FoxLoggerServiceOptions> = {
      provide: FOXLOGGER_SERVICE_OPTIONS,
      useValue: options,
    };

    return {
      module: FoxLoggerCoreModule,
      providers: [LoopModuleOptionsProvider, FoxLoggerService],
      exports: [FoxLoggerService],
    };
  }

  public static forRootAsync(
    options: FoxLoggerServiceAsyncOptions,
  ): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options);

    return {
      module: FoxLoggerCoreModule,
      providers: [
        /** Providers **/
        ...providers,
        /** Services **/
        FoxLoggerService,
        /** Extra providers **/
        ...(options.extraProviders || []),
      ],
      imports: options.imports,
      exports: [
        /** Services **/
        FoxLoggerService,
      ],
    };
  }

  public static createAsyncProviders(
    options: FoxLoggerServiceAsyncOptions,
  ): Provider[] {
    const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(
    options: FoxLoggerServiceAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        name: FOXLOGGER_SERVICE_OPTIONS,
        provide: FOXLOGGER_SERVICE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      name: FOXLOGGER_SERVICE_OPTIONS,
      provide: FOXLOGGER_SERVICE_OPTIONS,
      useFactory: async (optionsFactory: FoxLoggerServiceOptionsFactory) => {
        return optionsFactory.createLoopOptions();
      },
      inject: [options.useExisting! || options.useClass!],
    };
  }
}
