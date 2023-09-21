import request from 'supertest';
import { Test } from '@nestjs/testing';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from '../../src/modules/users/users.module';
import { UsersService } from '../../src/modules/users/users.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configValidationSchema } from '../../src/config.schema';
import { User } from '../../src/modules/users/user.entity';
import { Stock } from '../../src/modules/stocks/stock.entity';
import { Volume } from '../../src/modules/volumes/volume.entity';
import { AuthenticationModule } from '../../src/modules/authentication/authentication.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { StocksModule } from '../../src/modules/stocks/stocks.module';
import { VolumesModule } from '../../src/modules/volumes/volumes.module';
import { AuthenticationService } from '../../src/modules/authentication/authentication.service';
import { DataModule } from '../../src/modules/data/data.module';

// NOTE: How to run one test file:
// export TEST_PATH="test/modules/data.e2e-test.ts" &&  npm run docker:run:test:e2e:watch

describe('/data controller', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let usersService: UsersService;
  let authenticationService: AuthenticationService;
  let usersRepository: Repository<User>;
  let stocksRepository: Repository<Stock>;
  let volumesRepository: Repository<Volume>;

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
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
              expiresIn: 3600,
            },
          }),
        }),
        AuthenticationModule,
        UsersModule,
        StocksModule,
        VolumesModule,
        DataModule,
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

    configService = app.get(ConfigService);
    usersService = app.get(UsersService);
    authenticationService = app.get(AuthenticationService);
    stocksRepository = app.get('StockRepository');
    volumesRepository = app.get('VolumeRepository');
    usersRepository = app.get('UserRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  let authToken: string;
  beforeEach(async () => {
    const pass = '^#q3Z&rTu*5WGVP';
    const user = await usersService.create({
      login: 'testUserAdmin',
      password: pass,
      roles: ['admin'],
    });
    const auth = await authenticationService.login({
      login: user.login,
      pass,
    });
    authToken = auth.accessToken;
  });

  afterEach(async () => {
    await usersRepository.query(`DELETE FROM users;`);
    await volumesRepository.query(`DELETE FROM volumes;`);
    await stocksRepository.query(`DELETE FROM stocks;`);
  });

  describe('[PATCH] /update/filters', () => {
    // TODO: Create test for the case were latestRecordTime is not equal to the current date
    it('should update averages & filters', async () => {
      const stock = await stocksRepository.save({
        ticker: 'AAPL',
        shortVolRatioLast: 0.75,
        shortExemptVolRatioLast: 0.25,
        totalVolLast: 150,
        totalVol5dAvg: 150,
        shortVol5dAvg: 30,
        shortExemptVol5dAvg: 0.25,
        shortVolRatio5dAvg: 0.75,
      });
      await volumesRepository.save([
        {
          stockId: stock.id,
          date: new Date('2023-01-05'),
          shortVolume: 90,
          shortExemptVolume: 10,
          totalVolume: 200,
        },
        {
          stockId: stock.id,
          date: new Date('2023-01-04'),
          shortVolume: 125,
          shortExemptVolume: 25,
          totalVolume: 150,
        },
        {
          stockId: stock.id,
          date: new Date('2023-01-03'),
          shortVolume: 120,
          shortExemptVolume: 30,
          totalVolume: 150,
        },
        {
          stockId: stock.id,
          date: new Date('2023-01-02'),
          shortVolume: 100,
          shortExemptVolume: 50,
          totalVolume: 150,
        },
        {
          stockId: stock.id,
          date: new Date('2023-01-01'),
          shortVolume: 80,
          shortExemptVolume: 45,
          totalVolume: 200,
        },
      ]);

      const response = await request(app.getHttpServer())
        .patch('/data/update/filters')
        .auth(authToken, { type: 'bearer' })
        .expect(200);

      const updatedStock = await stocksRepository.findOne({
        where: { id: stock.id },
      });

      // Check averages
      expect(updatedStock.shortVolRatioLast).toBe(45);
      expect(updatedStock.shortExemptVolRatioLast).toBe(5);
      expect(updatedStock.totalVolLast).toBe(200);
      expect(updatedStock.shortExemptVolLast).toBe(10);
      expect(updatedStock.shortVolLast).toBe(90);
      expect(updatedStock.shortVolRatio5dAvg).toBe(60.588235294117645);
      expect(updatedStock.shortExemptVolRatio5dAvg).toBe(18.823529411764707);
      expect(updatedStock.shortExemptVol5dAvg).toBe(32);
      expect(updatedStock.totalVol5dAvg).toBe(170);
      expect(updatedStock.shortVol5dAvg).toBe(103);
    });
    it('should return 403 if admin secret is wrong', async () => {
      const pass = '^#q3Z&rTu*5WGVP';
      const user = await usersService.create({
        login: 'testUserNotAdmin',
        password: pass,
        roles: ['stockInfo'],
      });
      const auth = await authenticationService.login({
        login: user.login,
        pass,
      });

      await request(app.getHttpServer())
        .patch('/data/update/filters')
        .auth(auth.accessToken, { type: 'bearer' })
        .expect(403);
    });
  });
});
