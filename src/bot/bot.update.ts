import {
  Update,
  Ctx,
  Start,
  On,
  InjectBot,
  Message,
  Action,
} from 'nestjs-telegraf';
import { Telegraf, Context, Scenes } from 'telegraf';
import { forwardRef, Inject } from '@nestjs/common';
import { EventService } from 'src/event/event.service';
import { ExtendedContext } from 'src/bot/bot-session.interface';

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
        keyboard: [
          [
            { text: 'Оставить заявку на мероприятие' },
            { text: 'Мои мероприятия' },
          ],
        ],
        resize_keyboard: true,
      },
    });
  }

  @On('text')
  async textResolver(
    @Message('text') msg: string,
    @Message('from') from,
    @Message('chat') chat,
    @Ctx() ctx: Scenes.SceneContext & ExtendedContext,
  ) {
    if (msg === 'Оставить заявку на мероприятие') {
      ctx.scene.enter('createEvent');
    }
    if (msg === 'Мои мероприятия') {
      const events = await this.eventService.findAllId(from.id);
      if (events.length) {
        events.forEach((event) => {
          ctx.session.title = event['title'];
          const { _id } = event;
          const eventId = _id.toString();
          ctx.reply(event['title'], {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Редактировать', callback_data: 'asd' }],
                [
                  {
                    text: 'Удалить',
                    callback_data: `deleteEvent_${eventId}`,
                  },
                ],
              ],
            },
          });
        });
      } else {
        ctx.reply('Никаких мероприятий не запланировано');
      }
    }
  }

  @Action(/deleteEvent/)
  async deleteEvent(@Ctx() ctx: ExtendedContext) {
    const eventId = ctx.callbackQuery['data'] as string;
    const slicedId = eventId.slice(eventId.indexOf('_') + 1);
    await this.eventService.deleteEvent(slicedId);
  }
}
