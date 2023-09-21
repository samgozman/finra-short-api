import request from 'supertest';
import { Test } from '@nestjs/testing';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from '../../src/modules/users/users.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/modules/users/user.entity';
import { configValidationSchema } from '../../src/config.schema';
import { UsersService } from '../../src/modules/users/users.service';
import { AuthenticationModule } from '../../src/modules/authentication/authentication.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('/auth controller', () => {
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
    userService = app.get(UsersService);
    userRepository = app.get('UserRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await userRepository.query(`DELETE FROM users;`);
  });

  describe('[POST] /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .send({
          login: 'someLogin',
          pass: 'hufshfsuif8833SS!',
        })
        .expect(201);

      expect(response.body).toEqual({
        login: 'someLogin',
      });
      const users = await userRepository.findOne({
        where: { login: 'someLogin' },
      });
      expect(users).toBeDefined();
    });
    it('should return 403 if admin secret is wrong', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          login: 'someLogin',
          pass: 'hufshfsuif8833SS!',
        })
        .expect(403);
    });
    it('should return 400 if pass is to short', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .send({
          login: 'someLogin',
          pass: 'kakak',
        })
        .expect(400);
    });
    it('should return 409 if login is not unique', async () => {
      await userService.create({
        login: 'testUser',
        password: 'testPassword',
        roles: ['stockInfo'],
      });

      await request(app.getHttpServer())
        .post('/auth/register')
        .auth(configService.get('ADMIN_SECRET'), { type: 'bearer' })
        .send({
          login: 'testUser',
          pass: 'skfdhk7sHhf@!',
        })
        .expect(409);
    });
  });
  describe('[POST] /auth/login', () => {
    it('should login successfully', async () => {
      await userService.create({
        login: 'testUser',
        password: 'skfdhk7sHhf@!',
        roles: ['stockInfo'],
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: 'testUser',
          pass: 'skfdhk7sHhf@!',
        })
        .expect(201);

      expect(response.body).toEqual({
        accessToken: expect.any(String),
      });
    });
    it('should return 401 if user does not exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: 'testUser',
          pass: 'skfdhk7sHhf@!',
        })
        .expect(401);
    });
  });
});
