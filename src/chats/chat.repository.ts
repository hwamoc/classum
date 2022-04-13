import { PostStatus } from "src/posts/model/post-status.enum";
import { PostEntity } from "src/posts/post.entity";
import { User } from "src/user/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Chat } from "./chat.entity";
import { CreateChatDto } from "./dto/create-chat.dto";

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {

    async createChat(
        createChatDto: CreateChatDto, post: PostEntity, user: User
    ): Promise<Chat> {
        const { headChat, content, status } = createChatDto;

        const chat: Chat = this.create({
            headChat,
            userId: user.id,
            userName: user.fullname,
            content,
            status: PostStatus[status?.toUpperCase()],
            post
        });

        await this.save(chat);
        return chat;
    }

}