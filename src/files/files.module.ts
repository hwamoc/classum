import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileRepository])
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
