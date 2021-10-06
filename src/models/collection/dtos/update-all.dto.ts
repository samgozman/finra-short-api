import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateAllDto {
	@ApiProperty({
		description: `Run filters generation asynchronously (all at once in Promise.all).
			Requires a multi-core processor and more RAM for stable performance.`,
	})
	@IsBoolean()
	@Transform(({ value }) => (value === 'true' ? true : false))
	asynchronously? = false;
}
