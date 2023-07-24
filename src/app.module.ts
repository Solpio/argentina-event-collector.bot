import { Module } from '@nestjs/common';
import { BotModule } from 'src/bot/bot.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from 'src/event/event.module';

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
