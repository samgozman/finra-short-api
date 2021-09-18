import { Controller, Get } from '@nestjs/common';
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator,
		private db: MongooseHealthIndicator,
	) {}

	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			() =>
				this.http.pingCheck(
					'FINRA short sale page',
					'https://www.finra.org/finra-data/browse-catalog/short-sale-volume-data/daily-short-sale-volume-files',
				),
			() =>
				this.http.pingCheck(
					'FINRA txt volume (test 20210901)',
					'https://cdn.finra.org/equity/regsho/daily/CNMSshvol20210901.txt',
				),
			() =>
				this.http.pingCheck(
					'Tinkoff API',
					'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws',
					{ validateStatus: (status) => status === 401 },
				),
			() => this.db.pingCheck('mongodb'),
		]);
	}
}