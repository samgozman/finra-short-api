import { HttpService } from '@nestjs/axios';
import {
	Controller,
	Patch,
	Post,
	Logger,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import {
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';
import { map } from 'rxjs/operators';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { CollectionService } from './collection.service';
import { GetLinkDto } from './dtos/get-link.dto';

@ApiTags('collection')
@Controller('collection')
@UseInterceptors(new SentryInterceptor())
@ApiBearerAuth('auth-with-admin-role')
@ApiForbiddenResponse()
@ApiInternalServerErrorResponse()
@UseGuards(AuthGuard())
export class CollectionController {
	private readonly logger = new Logger(CollectionController.name);
	constructor(
		private collectionService: CollectionService,
		private httpService: HttpService,
	) {}

	@Patch('/recreate')
	@Roles('admin')
	@UseGuards(RolesGuard)
	@ApiOperation({
		summary:
			'Recreate full database from the start (parse tons of FINRA reports at once)',
	})
	recreateCollection() {
		return this.collectionService.recreateFullDatabase();
	}

	@Patch('/update/lastday')
	@Roles('admin')
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Fetch last trading days from FINRA' })
	updateLastDay() {
		return this.collectionService.updateLastTradingDays();
	}

	@Patch('/update/filters')
	@Roles('admin')
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Update filters and averages' })
	async updateFilters() {
		return this.httpService
			.get('http://analyzer:8000/run', {
				headers: {
					Accept: 'application/json',
				},
			})
			.pipe(map((response) => response.data));
	}

	@Post('/update/link')
	@Roles('admin')
	@UseGuards(RolesGuard)
	@ApiOperation({
		summary:
			'Update collection directly from the FINRA report txt file by link',
	})
	updateVolumesByLink(@Query() query: GetLinkDto) {
		return this.collectionService.updateVolumesByLink(query.link);
	}

	// Run at 18:30 (6.30pm/12 ET) on every day-of-week from Monday through Friday.
	// (01:30/24 Moscow time) (30 18 * * 1-5)
	@Cron('30 18 * * 1-5', {
		timeZone: 'America/New_York',
	})
	async updateLastDayWithFiltersAndAverages() {
		try {
			this.logger.warn('(¬_¬) CRON updater task has started');
			await this.updateLastDay();
			await this.updateFilters();
			this.logger.log('(¬_¬) CRON updater task has finished');
		} catch (error) {
			this.logger.error('Error while on Cron updater', error);
		}
	}
}
