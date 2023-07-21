import { Update, Ctx, Start, On, InjectBot, Message } from 'nestjs-telegraf';
import { Telegraf, Context, Scenes } from 'telegraf';
import { forwardRef, Inject } from '@nestjs/common';
import { EventService } from 'src/event/event.service';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
  ) {}

  @Start()
  async startCommand(
    @Message('from') from,
    @Message('chat') chat,
    @Ctx() ctx: Context,
  ) {
    await ctx.reply('Привет, можешь выбрать интересующую тебя функцию', {
      reply_markup: {
        keyboard: [[{ text: 'Оставить заявку на мероприятие' }]],
      },
    });
  }

  @On('text')
  async textResolver(
    @Message('text') msg: string,
    @Message('from') from,
    @Message('chat') chat,
    @Ctx() ctx: Scenes.SceneContext,
  ) {
    if (msg === 'Оставить заявку на мероприятие') {
      ctx.scene.enter('createEvent');
    }
  }
}
