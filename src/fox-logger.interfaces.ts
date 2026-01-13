import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

export interface FoxLoggerServiceOptions {
  timestamp?: boolean; // for compatibility

  name?: string;
  cls?: ClsService;
  formatter?: (msg: unknown) => string;
  prefixer?: (...args: unknown[]) => string;
}

export interface FoxLoggerServiceFeatureOptions
  extends FoxLoggerServiceOptions {
  name: Required<string>;
}

export interface FoxLoggerServiceOptionsFactory {
  createLoopOptions():
    | Promise<FoxLoggerServiceOptions>
    | FoxLoggerServiceOptions;
}

export interface FoxLoggerServiceAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<FoxLoggerServiceOptionsFactory>;
  useExisting?: Type<FoxLoggerServiceOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<FoxLoggerServiceOptions> | FoxLoggerServiceOptions;
  extraProviders?: Provider[];
}
