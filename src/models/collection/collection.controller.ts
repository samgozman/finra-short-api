import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { CollectionService } from './collection.service';

@Controller('collection')
@UseGuards(AuthGuard())
export class CollectionController {
	constructor(private collectionService: CollectionService) {}

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
		return 'Update filters';
	}

	@Get('/update/averages')
	@Roles('admin')
	@UseGuards(RolesGuard)
	updateAverages() {
		return 'Update Averages';
	}
}
