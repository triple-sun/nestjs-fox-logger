import { DynamicModule, Module, Provider, ValueProvider } from '@nestjs/common';

import { FOXLOGGER_SERVICE_OPTIONS } from './fox-logger.const';
import {
  FoxLoggerServiceAsyncOptions,
  FoxLoggerServiceOptions,
} from './fox-logger.interfaces';
import { FoxLoggerService } from './fox-logger.service';
import { FoxLoggerCoreModule } from './fox-logger-core.module';

@Module({})
export class FoxLoggerModule {
  public static forRoot(options: FoxLoggerServiceOptions): DynamicModule {
    return {
      module: FoxLoggerModule,
      imports: [
        /** Modules **/
        FoxLoggerCoreModule.forRoot(options!),
      ],
    };
  }

  public static forRootAsync(
    options: FoxLoggerServiceAsyncOptions,
  ): DynamicModule {
    return {
      module: FoxLoggerModule,
      imports: [
        /** Modules **/
        FoxLoggerCoreModule.forRootAsync(options),
      ],
    };
  }

  static forFeature(options: FoxLoggerServiceOptions): DynamicModule {
    const FoxLoggerOptionsProvider: ValueProvider<FoxLoggerServiceOptions> = {
      provide: FOXLOGGER_SERVICE_OPTIONS,
      useValue: options,
    };

    return {
      module: FoxLoggerModule,
      imports: [],
      providers: [FoxLoggerOptionsProvider, FoxLoggerService],
      exports: [FoxLoggerOptionsProvider, FoxLoggerService],
    };
  }

  static forFeatureAsync(options: FoxLoggerServiceAsyncOptions): DynamicModule {
    const providers: Provider[] =
      FoxLoggerCoreModule.createAsyncProviders(options);

    return {
      module: FoxLoggerModule,
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
        ...providers,
        /** Services **/
        FoxLoggerService,
      ],
    };
  }
}
