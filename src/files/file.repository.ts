import { EntityRepository, Repository } from 'typeorm';
import { FileType } from './file-type.enum';
import { FileEntity } from './file.entity';

@EntityRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> {

    buildFiles(fileUrls: string[], fileType: FileType): FileEntity[] {
        const fileEntities: FileEntity[] = [];
        for (const url of fileUrls) {
            const file: FileEntity = new FileEntity();
            file.url = url;
            file.type = fileType;
            fileEntities.push(file);
        }
        return fileEntities;
    }
}
