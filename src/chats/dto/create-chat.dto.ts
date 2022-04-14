import { IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { ChatStatusValidation } from "../validation/chat-status-validation";

export class CreateChatDto {

    headChat: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @Validate(ChatStatusValidation)
    status: string;

}

