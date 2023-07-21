import { Context } from 'telegraf';

export interface BotSessionData {
  title: string;
}

export interface ExtendedContext extends Context {
  session: BotSessionData;
}
