import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { FiltersService } from '../filters/filters.service';
import { AveragesService } from './averages.service';
import { CollectionService } from './collection.service';
import { GetLinkDto } from './dtos/get-link.dto';

@ApiTags('collection')
@Controller('collection')
@ApiBearerAuth('auth-with-admin-role')
@UseGuards(AuthGuard())
export class CollectionController {
	private readonly logger = new Logger(CollectionController.name);
	constructor(
		private collectionService: CollectionService,
		private averagesService: AveragesService,
		private filtersService: FiltersService,
	) {}

	@Get('/recreate')
	@Roles('admin')
	@UseGuards(RolesGuard)
	recreateCollection() {
		return this.collectionService.recreateFullDatabase();
	}

	@Get('/update/lastday')
	@Roles('admin')
	@UseGuards(RolesGuard)
	updateLastDay() {
		return this.collectionService.updateLastTradingDays();
	}

	@Get('/update/filters')
	@Roles('admin')
	@UseGuards(RolesGuard)
	updateFilters() {
		return this.filtersService.updateAll();
	}

	@Get('/update/averages')
	@Roles('admin')
	@UseGuards(RolesGuard)
	updateAverages() {
		return this.averagesService.averages();
	}

	/** Update collection directly from the FINRA report txt file by link */
	@Get('/update/link')
	@Roles('admin')
	@UseGuards(RolesGuard)
	updateVolumesByLink(@Query() query: GetLinkDto) {
		return this.collectionService.updateVolumesByLink(query.link);
	}

	// Run every day except Sunday at 6.30pm/12 ET (01:30/24 Moscow time) ('30 18 * * 1-6)
	@Cron('30 18 * * 1-6', {
		timeZone: 'America/New_York',
	})
	async updateLastDayWithFiltersAndAverages() {
		try {
			this.logger.warn('(¬_¬) CRON updater task has started');
			await this.updateLastDay();
			await this.updateAverages();
			await this.updateFilters();
			this.logger.log('(¬_¬) CRON updater task has finished');
		} catch (error) {
			this.logger.error('Error while on Cron updater', error);
		}
	}
}
