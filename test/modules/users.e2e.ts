import request from 'supertest';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../../src/modules/users/users.module';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/modules/users/user.entity';
import { AuthenticationModule } from '../../src/authentication/authentication.module';
import { AppService } from '../../src/app.service';
import { configValidationSchema } from '../../src/config.schema';
import { UsersService } from '../../src/modules/users/users.service';

describe('/user controller', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let userService: UsersService;
  let userRepository: Repository<User>;

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
            entities: [User],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AuthenticationModule,
        UsersModule,
      ],
      controllers: [],
      providers: [AppService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    configService = app.get<ConfigService>(ConfigService);
    userService = app.get<UsersService>(UsersService);
    userRepository = app.get('UserRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await userRepository.query(`DELETE FROM users;`);
  });

  describe('[GET] /list', () => {
    it('should return an empty array of users', () => {
      return request(app.getHttpServer())
        .get('/user/list')
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(200)
        .expect([]);
    });
    it('should return an array of users', async () => {
      await userService.create({
        login: 'testUser',
        password: 'testPassword',
      });

      return request(app.getHttpServer())
        .get('/user/list')
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(200)
        .expect([{ login: 'testUser', roles: ['stockInfo', 'screener'] }]);
    });
  });
});
