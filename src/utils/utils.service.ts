import { Injectable } from '@nestjs/common';
import { getFileURL } from './multer-options';

@Injectable()
export class UtilsService {
    public getFileUrl(file: Express.Multer.File): string {
        const generatedFile: string = getFileURL(file);
        // http://localhost:3000/public/파일이름 형식으로 저장이 됩니다.
        return generatedFile;
    }

    public getFilesUrlArray(files: Express.Multer.File[]): string[] {
        const urls: string[] = [];
        for (const file of files) {
            const generatedFile: string = getFileURL(file);
            urls.push(generatedFile);
        }
        return urls;
    }
}