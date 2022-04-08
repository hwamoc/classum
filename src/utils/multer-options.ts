import * as config from 'config';
import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
    fileFilter: (request, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return callback(new BadRequestException('지원하지 않는 이미지 형식입니다.'));
        }
        callback(null, true);
    },

    storage: diskStorage({
        destination: (request, file, callback) => {
            const uploadPath = `./${config.get('file.path')}`;
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            callback(null, uploadPath);
        },
        filename: (request, file, callback) => {
            const fileExtName = extname(file.originalname);
            const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
            callback(null, `${randomName}${fileExtName}`);
        },
    }),
    limits: {
        fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
        filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
        fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
        fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
        files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
    },
}

// 파일 업로드 경로
export const uploadFileURL = (file: Express.Multer.File): string => {
    const port = config.get('server.port');
    const uploadPath = config.get('file.path');
    return `http://localhost:${port}/${uploadPath}/${file.filename}`;
}