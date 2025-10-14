<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
</div>

<h3 align="center">NestJS Logger Module with Cls suitable for Winston-Graylog transport</h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Installation

```bash
npm install --save nestjs-fox-logger nest-cls
```

### Usage

#### Import

```ts
// In your root module
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers['X-Request-Id'] ?? nanoid(),
      },
      global: true,
    }),
  ],
})
export class AppModule {}

/// ...in a feature module
import { FoxLoggerModule } from 'nestjs-fox-logger';

@Module({
  imports: [
    LoggerModule.forFeature({
      name: UsersModule.name,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class UsersModule {}
```

#### Call

```typescript
import { LoopService } from 'nestjs-fox-logger';

@Injectable()
export class YourService {
  constructor(private readonly logger: FoxLoggerService) {}

  async foo() {
    const eventId = nanoid();
    await this.logger.log('someMessage', eventId);
  }
}
```

## Author

**Semen Kononets ([GitHub](https://github.com/triple-sun))**

## LICENSE

MIT
