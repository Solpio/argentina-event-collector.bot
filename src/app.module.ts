import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    EventModule,
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
