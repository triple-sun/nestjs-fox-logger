import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

export interface FoxLoggerServiceOptions {
  name?: string;
  cls?: ClsService;
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
