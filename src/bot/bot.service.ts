import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  async sendMessage(id: number, text: string) {
    return this.bot.telegram.sendMessage(id, text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Да', callback_data: 'True' }],
          [{ text: 'Нет', callback_data: 'False' }],
        ],
      },
    });
  }
}
