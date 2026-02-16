import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
