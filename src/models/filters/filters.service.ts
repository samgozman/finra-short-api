import { Injectable } from '@nestjs/common';
import { FilterUnitService } from './filter-unit.service';

@Injectable()
export class FiltersService {
	constructor(private readonly fus: FilterUnitService) {}

	async updateAll() {
		try {
			// Create empty filters before starting to update them in parallel
			await this.fus.createEmptyFilters();

			// ! Create object of functions and pass parameters into the Promise.all
			// ! Use Type defence for filters
			await Promise.all([
				this.fus.tinkoffFilter(),
				this.fus.isNotGarbageFilter(),
				// 5 days
				this.fus.volumeFilter('shortVolGrows5D', 'shortVolume', 'growing', 5),
				this.fus.volumeFilter(
					'shortVolDecreases5D',
					'shortVolume',
					'decreasing',
					5,
				),
				this.fus.volumeFilter(
					'shortVolRatioGrows5D',
					'shortVolume',
					'growing',
					5,
					true,
				),
				this.fus.volumeFilter(
					'shortVoRatiolDecreases5D',
					'shortVolume',
					'decreasing',
					5,
					true,
				),
				this.fus.volumeFilter('totalVolGrows5D', 'totalVolume', 'growing', 5),
				this.fus.volumeFilter(
					'totalVolDecreases5D',
					'totalVolume',
					'decreasing',
					5,
				),
				this.fus.volumeFilter(
					'shortExemptVolGrows5D',
					'shortExemptVolume',
					'growing',
					5,
				),
				this.fus.volumeFilter(
					'shortExemptVolDecreases5D',
					'shortExemptVolume',
					'decreasing',
					5,
				),
				this.fus.volumeFilter(
					'shortExemptVolRatioGrows5D',
					'shortExemptVolume',
					'growing',
					5,
					true,
				),
				this.fus.volumeFilter(
					'shortExemptVolRatioDecreases5D',
					'shortExemptVolume',
					'decreasing',
					5,
					true,
				),
				// 3 days
				this.fus.volumeFilter('shortVolGrows3D', 'shortVolume', 'growing', 3),
				this.fus.volumeFilter(
					'shortVolDecreases3D',
					'shortVolume',
					'decreasing',
					3,
				),
				this.fus.volumeFilter(
					'shortVolRatioGrows3D',
					'shortVolume',
					'growing',
					3,
					true,
				),
				this.fus.volumeFilter(
					'shortVoRatiolDecreases3D',
					'shortVolume',
					'decreasing',
					3,
					true,
				),
				this.fus.volumeFilter('totalVolGrows3D', 'totalVolume', 'growing', 3),
				this.fus.volumeFilter(
					'totalVolDecreases3D',
					'totalVolume',
					'decreasing',
					3,
				),
				this.fus.volumeFilter(
					'shortExemptVolGrows3D',
					'shortExemptVolume',
					'growing',
					3,
				),
				this.fus.volumeFilter(
					'shortExemptVolDecreases3D',
					'shortExemptVolume',
					'decreasing',
					3,
				),
				this.fus.volumeFilter(
					'shortExemptVolRatioGrows3D',
					'shortExemptVolume',
					'growing',
					3,
					true,
				),
				this.fus.volumeFilter(
					'shortExemptVolRatioDecreases3D',
					'shortExemptVolume',
					'decreasing',
					3,
					true,
				),
			]).then(function () {
				console.log('Filter collection was regenerated.');
			});
		} catch (error) {
			console.error('Error in updateAllFilters: ' + error);
		}
	}
}
