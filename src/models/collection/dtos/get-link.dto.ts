import { IsUrl } from 'class-validator';

export class GetLinkDto {
	@IsUrl()
	link: string;
}
