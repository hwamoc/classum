import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Self } from 'src/auth/decorator/self.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SelfGuard } from 'src/auth/guards/self.guard';
import { RoleSanitizeInterceptor } from 'src/common/interceptors/role-sanitize.interceptor';
import { AppLogger } from 'src/common/logger/logger.service';
import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('spaces/posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class ChatsController {
    constructor(
        private chatsService: ChatsService,
        private readonly appLogger: AppLogger,
    ) {}

    @Get('/:postId/chats')
    @UseInterceptors(RoleSanitizeInterceptor)
    getAllChats(
        @Param('postId', ParseIntPipe) postId: number,
        @GetUser() user: User
    ): Promise<Chat[]> {
        this.appLogger.log(`GET /spaces/posts/${postId}/chats has been excuted.`);
        return this.chatsService.getAllChats(postId, user);
    }

    @Post('/:postId/chats')
    createChat(
        @Param('postId', ParseIntPipe) postId: number,
        @Body(ValidationPipe) createChatDto: CreateChatDto, // dto의 userId는 작성자 아이디를 의미하며, 익명 글 작성 여부 판별에 사용된다.
        @GetUser() user: User
    ): Promise<Chat> {
        this.appLogger.log(`POST /spaces/posts/${postId}/chats has been excuted.`);
        return this.chatsService.createChat(postId, createChatDto, user);
    }

    @Delete('/chats/:id')
    @Self({userIDParam: 'writerId', allowAdmins: true})
    @UseGuards(SelfGuard)
    deleteChat(
        @Param('id', ParseIntPipe) id: number,
        @Param('writerId') writerId: number,  // 작성자 id, SelfGuard에서 사용함
    ): Promise<string> {
        this.appLogger.log(`DELETE /spaces/posts/chats/${id} has been excuted.`);
        return this.chatsService.deleteChat(id);
    }
}
