import { Controller, Get } from '@nestjs/common';
import { CollectionService } from './collection.service';

// ! AdminGuard
@Controller('collection')
export class CollectionController {
	constructor(private collectionService: CollectionService) {}

	// ! Only dev route! Use CLI params in prod!
	@Get('/recreate')
	recreateCollection() {
		return 'Recreate collection';
	}

	@Get('/update/lastday')
	updateLastDay() {
		return 'Update Last Day';
	}

	@Get('/update/filters')
	updateFilters() {
		return 'Update filters';
	}

	@Get('/update/averages')
	updateAverages() {
		return 'Update Averages';
	}
}
