import { Module } from '@nestjs/common';
import { VolumesService } from './volumes.service';
import { Volume } from './volume.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Volume])],
  providers: [VolumesService],
  controllers: [],
})
export class VolumesModule {}
