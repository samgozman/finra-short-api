import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import request from 'supertest';
import { getConnectionToken } from '@nestjs/mongoose';
import { createTestUser } from './createTestUser';
import { AuthCredentialsDto } from 'src/authentication/dtos/auth-credentials.dto';
import { IStock } from 'src/modules/stocks/schemas/stock.schema';
import { StockDto } from 'src/modules/stocks/dtos/stock.dto';

jest.setTimeout(30000);

const testUser: AuthCredentialsDto = {
	login: 'test-user',
	pass: 'KekTestPass1234',
};

const testStock: Partial<IStock> = {
	ticker: 'AAPL',
	shortVolRatioLast: 39.389942332818286,
	shortExemptVolRatioLast: 0.27084895447165275,
	totalVolLast: 38222780,
	shortVolRatio5DAVG: 39.81572377893098,
	shortExemptVolRatio5DAVG: 0.31256929846928533,
	totalVol5DAVG: 32885827.4,
	shortVolRatio20DAVG: 36.86432020597808,
	shortExemptVolRatio20DAVG: 0.2833749307219477,
	totalVol20DAVG: 31675526.05,
};

describe('StocksController (e2e)', () => {
	let app: INestApplication;
	let connection: Connection;
	let apiKey: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		// Get db connection and drop
		connection = await moduleFixture.get(getConnectionToken());
		await connection.dropDatabase();

		// 1. Register test user with role
		apiKey = (
			await createTestUser(app, connection, testUser, ['admin', 'stockInfo'])
		).apikey;

		// 2. Fill db with one stock
		await connection.collection('stocks').insertOne(testStock);
	});

	afterEach(async () => {
		await connection.close(true);
	});

	it('/stock: should not get stock if unauthorized', async () => {
		// Wrong key
		await request(app.getHttpServer())
			.get('/stock?ticker=AAPL')
			.set('token', 'sfksdjhfhjksdhfjh')
			.expect(403);

		// No key
		await request(app.getHttpServer()).get('/stock?ticker=AAPL').expect(403);
	});

	it('/stock: should get one stock', async () => {
		const { body }: { body: StockDto } = await request(app.getHttpServer())
			.get('/stock?ticker=AAPL')
			.set('token', apiKey)
			.expect(200);

		expect(body.ticker).toEqual(testStock.ticker);
	});
});
