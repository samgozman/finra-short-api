import request from 'supertest';
import { Test } from '@nestjs/testing';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from '../../src/modules/users/users.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
      providers: [
        AppService,
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
    userService = app.get(UsersService);
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

    it('should return 403 if admin secret is not provided', async () => {
      return request(app.getHttpServer()).get('/user/list').expect(403);
    });
  });

  describe('[POST] /api', () => {
    it('should create api key for user', async () => {
      await userService.create({
        login: 'testUser',
        password: 'testPassword',
      });

      const resutl = await request(app.getHttpServer())
        .post('/user/api')
        .send({ login: 'testUser' })
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(201);

      expect(resutl.body).toEqual({
        apiKey: expect.stringContaining('testUser:'),
      });
      expect(resutl.body.apiKey.length).toBeGreaterThan(32);
    });

    it('should return 404 if user is not found', async () => {
      return request(app.getHttpServer())
        .post('/user/api')
        .send({ login: 'unfoundedUser' })
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(404);
    });

    it('should return 400 if login is not provided', async () => {
      return request(app.getHttpServer())
        .post('/user/api')
        .send({})
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(400);
    });

    it('should return 403 if admin secret is not provided', async () => {
      return request(app.getHttpServer())
        .post('/user/api')
        .send({ login: 'testUser' })
        .expect(403);
    });
  });

  describe('[PATCH] /roles', () => {
    it('should add new role for the user', async () => {
      await userService.create({
        login: 'testUser',
        password: 'testPassword',
        roles: ['stockInfo'],
      });

      return request(app.getHttpServer())
        .patch('/user/roles')
        .send({ login: 'testUser', role: 'screener' })
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(200)
        .expect({ login: 'testUser', roles: ['stockInfo', 'screener'] });
    });

    it('should return 404 if user is not found', async () => {
      return request(app.getHttpServer())
        .patch('/user/roles')
        .send({ login: 'unfoundedUser', role: 'screener' })
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(404);
    });

    it('should return 400 if login is not provided', async () => {
      return request(app.getHttpServer())
        .patch('/user/roles')
        .send({ role: 'screener' })
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(400);
    });

    it('should return 400 if role is not provided', async () => {
      return request(app.getHttpServer())
        .patch('/user/roles')
        .send({ login: 'testUser' })
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .expect(400);
    });

    it('should return 403 if admin secret is not provided', async () => {
      return request(app.getHttpServer())
        .patch('/user/roles')
        .send({ login: 'testUser', role: 'screener' })
        .expect(403);
    });
  });
});
