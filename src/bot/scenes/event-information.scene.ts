import { Action, Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';
import { forwardRef, Inject } from '@nestjs/common';
import { EventService } from 'src/event/event.service';
import { BotService } from 'src/bot/bot.service';

@Wizard('createEvent')
export class EventInformationScene {
  constructor(
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
    @Inject(forwardRef(() => BotService))
    private readonly botService: BotService,
  ) {}
  @WizardStep(0)
  async step0(
    @Message('text') msg: string,
    @Ctx() ctx: Context & WizardContext,
  ) {
    ctx.wizard.state['data'] = {};
    await ctx.reply('Введите название мероприятия', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    ctx.wizard.next();
  }

  @WizardStep(1)
  async step1(
    @Message('text') msg: string,
    @Ctx() ctx: Context & WizardContext,
  ) {
    ctx.wizard.state['data'] = { ...ctx.wizard.state['data'], eventName: msg };
    await ctx.reply('Введите ссылку на мероприятие');
    if (msg) {
      ctx.wizard.next();
    }
  }

  @WizardStep(2)
  async step2(
    @Message('text') msg: string,
    @Ctx() ctx: Context & WizardContext,
  ) {
    ctx.wizard.state['data'] = { ...ctx.wizard.state['data'], eventLink: msg };
    await ctx.reply('Введите краткое описание мероприятия');
    if (msg) {
      ctx.wizard.next();
    }
  }

  @WizardStep(3)
  async step3(
    @Message('text') msg: string,
    @Ctx()
    ctx: Context & WizardContext & { update: Update.CallbackQueryUpdate },
  ) {
    ctx.wizard.state['data'] = {
      ...ctx.wizard.state['data'],
      eventDescription: msg,
    };
    await ctx.reply(
      'Введите дату начала мероприятия \n Формат: dd/mm/yyyy \n Например: 17/06/2023',
    );
    if (msg) {
      ctx.wizard.next();
    }
  }

  @WizardStep(4)
  async step4(
    @Message('text') msg: string,
    @Ctx()
    ctx: Context & WizardContext & { update: Update.CallbackQueryUpdate },
  ) {
    ctx.wizard.state['data'] = { ...ctx.wizard.state['data'], eventDate: msg };
    await ctx.reply('Введите время начала мероприятия');
    if (msg) {
      ctx.wizard.next();
    }
  }

  @WizardStep(5)
  async step5(
    @Message('text') msg: string,
    @Ctx() ctx: Context & WizardContext,
  ) {
    ctx.wizard.state['data'] = { ...ctx.wizard.state['data'], eventTime: msg };
    await ctx.reply(
      `Ваше мероприятие:\n\nНазвание: ${ctx.wizard.state['data'].eventName}\nСсылка: ${ctx.wizard.state['data'].eventLink}\nОписание: ${ctx.wizard.state['data'].eventDescription}
      \nДата: ${ctx.wizard.state['data'].eventDate}\nВремя: ${ctx.wizard.state['data'].eventTime}`,
    );
    await ctx.reply(`Все верно?`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Да', callback_data: 'True' }],
          [{ text: 'Нет', callback_data: 'False' }],
        ],
      },
    });
    await ctx.wizard.next();
  }

  @WizardStep(6)
  async step6(
    @Ctx()
    ctx: Context & WizardContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    if (cbQuery) {
      const userAnswer = 'data' in cbQuery ? cbQuery.data : null;

      if (userAnswer === 'False') {
        await ctx.scene.reenter();
      } else {
        await this.eventService.create({
          id: ctx.from.id,
          title: ctx.wizard.state['data'].eventName,
          link: ctx.wizard.state['data'].eventLink,
          description: ctx.wizard.state['data'].eventDescription,
          time: ctx.wizard.state['data'].eventTime,
          isApproved: false,
          date: ctx.wizard.state['data'].eventDate,
        });
        await ctx.reply('Ваши данные были сохранены');
        await this.botService.sendMessage(
          250101824,
          `Новое мероприятие\n ${ctx.wizard.state['data'].eventName}`,
        );
        await ctx.scene.leave();
      }
    }
  }

  @Action('1')
  async action(@Ctx() ctx: Context & WizardContext) {
    console.log(ctx);
  }
}
