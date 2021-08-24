import { Injectable } from '@nestjs/common';
import { FilterUnitService } from './filter-unit.service';
import { IFiltersList } from './schemas/filter.schema';

@Injectable()
export class FiltersService {
	constructor(private readonly fus: FilterUnitService) {}

	/**
	 * Get object of filters update functions
	 * @returns
	 */
	private getFiltersUpdaters() {
		const updaters: { [key in keyof IFiltersList]: () => Promise<void> } = {
			onTinkoff: this.fus.tinkoffFilter(),
			isNotGarbage: this.fus.isNotGarbageFilter(),
			// 5 days
			shortVolGrows5D: this.fus.volumeFilter(
				'shortVolGrows5D',
				'shortVolume',
				'growing',
				5,
			),
			shortVolDecreases5D: this.fus.volumeFilter(
				'shortVolDecreases5D',
				'shortVolume',
				'decreasing',
				5,
			),
			shortVolRatioGrows5D: this.fus.volumeFilter(
				'shortVolRatioGrows5D',
				'shortVolume',
				'growing',
				5,
				true,
			),
			shortVoRatiolDecreases5D: this.fus.volumeFilter(
				'shortVoRatiolDecreases5D',
				'shortVolume',
				'decreasing',
				5,
				true,
			),
			totalVolGrows5D: this.fus.volumeFilter(
				'totalVolGrows5D',
				'totalVolume',
				'growing',
				5,
			),
			totalVolDecreases5D: this.fus.volumeFilter(
				'totalVolDecreases5D',
				'totalVolume',
				'decreasing',
				5,
			),
			shortExemptVolGrows5D: this.fus.volumeFilter(
				'shortExemptVolGrows5D',
				'shortExemptVolume',
				'growing',
				5,
			),
			shortExemptVolDecreases5D: this.fus.volumeFilter(
				'shortExemptVolDecreases5D',
				'shortExemptVolume',
				'decreasing',
				5,
			),
			shortExemptVolRatioGrows5D: this.fus.volumeFilter(
				'shortExemptVolRatioGrows5D',
				'shortExemptVolume',
				'growing',
				5,
				true,
			),
			shortExemptVolRatioDecreases5D: this.fus.volumeFilter(
				'shortExemptVolRatioDecreases5D',
				'shortExemptVolume',
				'decreasing',
				5,
				true,
			),
			// 3 days
			shortVolGrows3D: this.fus.volumeFilter(
				'shortVolGrows3D',
				'shortVolume',
				'growing',
				3,
			),
			shortVolDecreases3D: this.fus.volumeFilter(
				'shortVolDecreases3D',
				'shortVolume',
				'decreasing',
				3,
			),
			shortVolRatioGrows3D: this.fus.volumeFilter(
				'shortVolRatioGrows3D',
				'shortVolume',
				'growing',
				3,
				true,
			),
			shortVoRatiolDecreases3D: this.fus.volumeFilter(
				'shortVoRatiolDecreases3D',
				'shortVolume',
				'decreasing',
				3,
				true,
			),
			totalVolGrows3D: this.fus.volumeFilter(
				'totalVolGrows3D',
				'totalVolume',
				'growing',
				3,
			),
			totalVolDecreases3D: this.fus.volumeFilter(
				'totalVolDecreases3D',
				'totalVolume',
				'decreasing',
				3,
			),
			shortExemptVolGrows3D: this.fus.volumeFilter(
				'shortExemptVolGrows3D',
				'shortExemptVolume',
				'growing',
				3,
			),
			shortExemptVolDecreases3D: this.fus.volumeFilter(
				'shortExemptVolDecreases3D',
				'shortExemptVolume',
				'decreasing',
				3,
			),
			shortExemptVolRatioGrows3D: this.fus.volumeFilter(
				'shortExemptVolRatioGrows3D',
				'shortExemptVolume',
				'growing',
				3,
				true,
			),
			shortExemptVolRatioDecreases3D: this.fus.volumeFilter(
				'shortExemptVolRatioDecreases3D',
				'shortExemptVolume',
				'decreasing',
				3,
				true,
			),
		};

		return updaters;
	}

	/**
	 * Regenerate all filters from the start
	 */
	async updateAll() {
		try {
			// Create empty filters before starting to update them in parallel
			await this.fus.createEmptyFilters();
			const updaters = this.getFiltersUpdaters();
			await Promise.all([...Object.values(updaters).map((e) => e())]).then(
				function () {
					console.log('Filter collection was regenerated.');
				},
			);
		} catch (error) {
			console.error('Error in updateAllFilters: ' + error);
		}
	}
}
