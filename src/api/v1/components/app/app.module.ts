import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesEntity } from './models/spaces.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpacesEntity])],
  controllers: [AppController],
  providers: [AppService]
})
export class AppComponentModule {}
