import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	create(login: string, pass: string) {
		return `Login: ${login}, Pass: ${pass}`;
	}
}
