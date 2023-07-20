import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';

@Wizard('story1')
export class EventInformationScene {
  @WizardStep(0)
  step1(@Message('text') msg: string, @Ctx() ctx: Context & WizardContext) {
    ctx.wizard.state['data'] = {};
    ctx.reply('Введите название мероприятия', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    ctx.wizard.next();
    return;
  }

  @WizardStep(1)
  async step2(
    @Message('text') msg: string,
    @Ctx() ctx: Context & WizardContext,
  ) {
    ctx.wizard.state['data'] = { ...ctx.wizard.state['data'], eventName: msg };
    ctx.reply('Введите ссылку на мероприятие');
    if (msg) {
      ctx.wizard.next();
    }
    return;
  }

  @WizardStep(2)
  async step3(
    @Message('text') msg: string,
    @Ctx() ctx: Context & WizardContext,
  ) {
    ctx.wizard.state['data'] = { ...ctx.wizard.state['data'], eventLink: msg };
    await ctx.reply('Введите краткое описание мероприятия');
    if (msg) {
      ctx.wizard.next();
    }
    return;
  }

  @WizardStep(3)
  async step4(
    @Message('text') msg: string,
    @Ctx() ctx: Context & WizardContext,
  ) {
    ctx.wizard.state['data'] = {
      ...ctx.wizard.state['data'],
      eventDescription: msg,
    };
    await ctx.reply(
      `Ваше мероприятие:\n\nНазвание: ${ctx.wizard.state['data'].eventName}\nСсылка: ${ctx.wizard.state['data'].eventLink}\nОписание: ${ctx.wizard.state['data'].eventDescription}`,
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
    return;
  }

  @WizardStep(4)
  async step5(
    @Ctx()
    ctx: Context & WizardContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;

    if (userAnswer === 'False') {
      await ctx.scene.reenter();
    } else {
      await ctx.reply('Ваши данные были сохранены');
      await ctx.scene.leave();
    }
  }
}
