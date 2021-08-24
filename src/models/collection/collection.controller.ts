import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { FiltersService } from '../filters/filters.service';
import { AveragesService } from './averages.service';
import { CollectionService } from './collection.service';

// ! Log after success

@Controller('collection')
@UseGuards(AuthGuard())
export class CollectionController {
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
}
