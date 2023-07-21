import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventDto } from 'src/event/dto/event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(createDto: EventDto): Promise<Event> {
    const createEvent = new this.eventModel(createDto);
    return createEvent.save();
  }
  async findById(id: string) {
    const obj = new Types.ObjectId(id);
    return this.eventModel.findOne({ _id: obj });
  }

  async findAllId(id: number) {
    return this.eventModel.find({ id });
  }

  async findAndDelete(id: string) {
    const obj = new Types.ObjectId(id);
    return this.eventModel.findOneAndDelete({ _id: obj });
  }

  async deleteEvent(id: string) {
    return this.findAndDelete(id);
  }
}
