import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export interface FoxLoggerServiceOptions {
  name?: string;
  timestamp?: boolean;
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
