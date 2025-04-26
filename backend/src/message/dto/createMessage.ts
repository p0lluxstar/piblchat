import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  readonly chatId: number;

  @IsNotEmpty()
  readonly text: string;
}
