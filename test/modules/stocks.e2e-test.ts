import request from 'supertest';
import { Test } from '@nestjs/testing';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from '../../src/modules/users/users.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configValidationSchema } from '../../src/config.schema';
import { UsersService } from '../../src/modules/users/users.service';
import { Stock } from '../../src/modules/stocks/stock.entity';
import { Volume } from '../../src/modules/volumes/volume.entity';
import { User } from '../../src/modules/users/user.entity';
import { StocksModule } from '../../src/modules/stocks/stocks.module';
import { VolumesModule } from '../../src/modules/volumes/volumes.module';
import { AuthenticationModule } from '../../src/modules/authentication/authentication.module';

// NOTE: How to run one test file:
// export TEST_PATH="test/modules/stocks.e2e-test.ts" &&  npm run docker:run:test:e2e:watch

describe('/stock controller', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let stocksRepository: Repository<Stock>;
  let usersRepository: Repository<User>;
  let volumesRepository: Repository<Volume>;
  let apiToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `config/.${process.env.NODE_ENV}.env`,
          validationSchema: configValidationSchema,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('POSTGRES_HOST'),
            port: +configService.get<number>('POSTGRES_PORT'),
            username: configService.get('POSTGRES_USER'),
            password: configService.get('POSTGRES_PASSWORD'),
            database: configService.get('POSTGRES_DB'),
            entities: [User, Stock, Volume],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AuthenticationModule,
        UsersModule,
        StocksModule,
        VolumesModule,
      ],
      controllers: [],
      providers: [
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
          }),
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    usersService = app.get(UsersService);
    stocksRepository = app.get('StockRepository');
    usersRepository = app.get('UserRepository');
    volumesRepository = app.get('VolumeRepository');
  });

  beforeEach(async () => {
    const user = await usersService.create({
      login: 'testUser',
      password: '^#q3Z&rTu*5WGVP',
      roles: ['stockInfo'],
    });
    const { apiKey } = await usersService.createApiKey(user.login);
    apiToken = apiKey;
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await volumesRepository.query(`DELETE FROM volumes;`);
    await stocksRepository.query(`DELETE FROM stocks;`);
    await usersRepository.query(`DELETE FROM users;`);
  });

  describe('GET /stock', () => {
    it('should work', async () => {
      const stock = await stocksRepository.save({
        ticker: 'AAPL',
        shortVolRatioLast: 0.75,
        shortExemptVolRatioLast: 0.25,
        totalVolLast: 150,
      });
      await volumesRepository.save({
        stockId: stock.id,
        date: new Date('2023-01-02'),
        shortVolume: 120,
        shortExemptVolume: 30,
        totalVolume: 150,
      });

      await volumesRepository.save({
        stockId: stock.id,
        date: new Date('2023-01-01'),
        shortVolume: 100,
        shortExemptVolume: 50,
        totalVolume: 150,
      });

      const result = await request(app.getHttpServer())
        .get('/stock')
        .set('token', apiToken)
        .query({ ticker: 'AAPL', limit: 10 })
        .expect(200);

      expect(result.body).toBeDefined();
      expect(result.body.ticker).toEqual('AAPL');
      expect(result.body.shortVolRatioLast).toEqual(0.75);
      expect(result.body.shortExemptVolRatioLast).toEqual(0.25);
      expect(result.body.totalVolLast).toEqual(150);
      expect(result.body.volumes).toHaveLength(2);
      expect(result.body.volumes[0].shortVolume).toEqual(100);
      expect(result.body.volumes[0].shortExemptVolume).toEqual(50);
      expect(result.body.volumes[0].totalVolume).toEqual(150);
      expect(result.body.volumes[1].shortVolume).toEqual(120);
      expect(result.body.volumes[1].shortExemptVolume).toEqual(30);
      expect(result.body.volumes[1].totalVolume).toEqual(150);
    });
    it('should return 404 if stock not found', async () => {
      await request(app.getHttpServer())
        .get('/stock')
        .set('token', apiToken)
        .query({ ticker: 'MSFT' })
        .expect(404);
    });
  });
});
