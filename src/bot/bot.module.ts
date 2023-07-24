import { forwardRef, Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from 'src/bot/bot.update';
import { session } from 'telegraf';
import { EventInformationScene } from 'src/bot/scenes/event-information.scene';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_API_KEY,
      middlewares: [session()],
    }),
    forwardRef(() => EventModule),
  ],
  controllers: [BotController],
  providers: [BotService, BotUpdate, EventInformationScene],
  exports: [BotService],
})
export class BotModule {}
