import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	controllers: [HealthController],
	imports: [ConfigModule, TerminusModule, HttpModule],
	providers: [
		ConfigService,
	],
})
export class HealthModule {}
