import { Injectable } from '@nestjs/common';
import { uploadFileURL } from './multer-options';

@Injectable()
export default class UtilsService {
    public uploadFile(file: Express.Multer.File): string {
        const generatedFile: string = uploadFileURL(file);
        // http://localhost:3000/public/파일이름 형식으로 저장이 됩니다.
        return generatedFile;
    }
}