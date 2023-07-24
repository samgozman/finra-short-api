import { Injectable } from '@nestjs/common';
import { Volume } from './volume.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VolumesService {
  constructor(
    @InjectRepository(Volume)
    private readonly volumesRepository: Repository<Volume>,
  ) {}

  async insertMany(volumes: Volume[]) {
    return this.volumesRepository
      .createQueryBuilder()
      .insert()
      .values(volumes)
      .execute();
  }
}