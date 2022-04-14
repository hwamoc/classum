import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { FileEntity } from './file.entity';
import { FileType } from './file-type.enum';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FileRepository) 
        private fileRepository: FileRepository
    ) {}

    buildFiles(fileUrls: string[], fileType: FileType): FileEntity[] {
        return this.fileRepository.buildFiles(fileUrls, fileType);
    }
}
