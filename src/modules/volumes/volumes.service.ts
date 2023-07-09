import { Injectable } from '@nestjs/common';
import { Volume } from './volume.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VolumesService {
  constructor(private readonly volumesRepository: Repository<Volume>) {}

  async insertMany(volumes: Volume[]) {
    return this.volumesRepository
      .createQueryBuilder()
      .insert()
      .values(volumes)
      .execute();
  }
}
