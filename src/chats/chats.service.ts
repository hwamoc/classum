import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {

    constructor(
        @InjectRepository(ChatRepository) 
        private chatRepository: ChatRepository,
        private postsService: PostsService,
    ) {}

    async getAllChats(postId: number, user: User): Promise<Chat[]> {
        const chats: Chat[] = await this.chatRepository.find({ where: { post: postId } });
        return chats;
    }

    async createChat(
        postId: number, createChatDto: CreateChatDto, user: User
    ): Promise<Chat> {
        const post: PostEntity = await this.postsService.getPost(postId, false);
        return this.chatRepository.createChat(createChatDto, post, user);
    }

    async deleteChat(id: number): Promise<string> {
        const result = await this.chatRepository.softDelete({ id });
        if (result.affected === 0) {
            throw new NotFoundException(`Can't delete chat with id: ${id}`);
        }
        return 'successfully deleted';
    }
}
