import { SpacesEntity } from './../models/spaces.entity';
import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { resourceLimits } from 'worker_threads';

@Controller('spaces')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getSpaces(): Promise<SpacesEntity[]> {
    return this.appService.getSpaces();
  }

  @Get('/:building/:id')
  async getSpace(@Param() params) {
    const building = params.building.toUpperCase();
    const unit = params.id;
    return this.appService.getSpace(building, unit);
  }

  @Put()
  update(@Body() body) {
    return this.appService.update(body);
  }
}
