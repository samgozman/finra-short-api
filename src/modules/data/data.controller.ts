import {
  Controller,
  Patch,
  Post,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cron } from '@nestjs/schedule';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { DataService } from './data.service';
import { GetLinkDto } from './dtos/get-link.dto';

@ApiTags('collection')
@ApiBearerAuth('auth-with-admin-role')
@ApiForbiddenResponse()
@ApiInternalServerErrorResponse()
@UseGuards(AuthGuard())
@Controller('data')
export class DataController {
  private readonly logger = new Logger(DataController.name);
  constructor(private collectionService: DataService) {}

  @Patch('/recreate')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary:
      'Recreate full database from the start (parse tons of FINRA reports at once)',
  })
  recreateCollection() {
    return this.collectionService.recreateFullDatabase();
  }

  @Patch('/update/last-days')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Fetch last trading days from FINRA' })
  updateLastDays() {
    return this.collectionService.updateLastTradingDays();
  }

  @Patch('/update/filters')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update filters and averages' })
  updateFilters() {
    return this.collectionService.updateFilters();
  }

  @Post('/update/link')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary:
      'Update collection directly from the FINRA report txt file by link',
  })
  updateVolumesByLink(@Query() query: GetLinkDto) {
    return this.collectionService.updateVolumesByLink(query.link);
  }

  // Run at 18:30 (6.30pm/12 ET) on every day-of-week from Monday through Friday.
  // 22:30 UTC
  @Cron('30 22 * * 1-5')
  async updateLastDayWithFiltersAndAverages() {
    try {
      this.logger.warn('(¬_¬) CRON updater task has started');
      await this.updateLastDays();
      await this.updateFilters();
      this.logger.log('(¬_¬) CRON updater task has finished');
    } catch (error) {
      this.logger.error('Error while on Cron updater', error);
    }
  }
}
