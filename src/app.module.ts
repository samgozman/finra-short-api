import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StocksModule } from './stocks/stocks.module';
import { VolumesModule } from './volumes/volumes.module';
import { FiltersModule } from './filters/filters.module';
import { CollectionModule } from './collection/collection.module';

@Module({
	imports: [UsersModule, StocksModule, VolumesModule, FiltersModule, CollectionModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
