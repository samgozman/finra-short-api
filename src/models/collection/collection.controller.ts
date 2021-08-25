import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { FiltersService } from '../filters/filters.service';
import { AveragesService } from './averages.service';
import { CollectionService } from './collection.service';

// ! Log after success

@Controller('collection')
@UseGuards(AuthGuard())
export class CollectionController {
	private readonly logger = new Logger(CollectionController.name);
	constructor(
		private collectionService: CollectionService,
		private averagesService: AveragesService,
		private filtersService: FiltersService,
	) {}

	// ! Only dev route! Use CLI params in prod!
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
		return this.collectionService.updateLastTradingDay();
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
