import * as config from 'config';
import { Controller, Get, Param, Res } from '@nestjs/common';
@Controller()
export class UtilsController {
    @Get('/public/:imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        const uploadPath = config.get('file.path');
        return res.sendFile(image, { root: `./${uploadPath}` });
    }
}
