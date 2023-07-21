import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from 'src/event/dto/event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(createDto: EventDto): Promise<Event> {
    const createEvent = new this.eventModel(createDto);
    return createEvent.save();
  }
}
