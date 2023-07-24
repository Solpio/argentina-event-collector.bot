import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

interface IEvent {
  id: number;
  title: string;
  link: string;
  description: string;
  date: string;
  isApproved: boolean;
  time: string;
}

export type EventDocument = HydratedDocument<IEvent>;

@Schema()
export class Event {
  @Prop()
  id: number;

  @Prop()
  title: string;

  @Prop()
  link: string;

  @Prop()
  description: string;

  @Prop()
  date: string;

  @Prop()
  isApproved: boolean;

  @Prop()
  time: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
