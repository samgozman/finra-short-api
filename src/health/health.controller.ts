import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	MongooseHealthIndicator,
} from '@nestjs/terminus';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

@ApiTags('health')
@Controller('health')
@UseInterceptors(new SentryInterceptor())
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator,
		private db: MongooseHealthIndicator,
	) {}

	@Get()
	@HealthCheck()
	@ApiOperation({ summary: 'Health check, ping check for DB, FINRA etc.' })
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
			() => this.db.pingCheck('mongodb'),
		]);
	}
}
