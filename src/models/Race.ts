import { ReturnModelType, getModelForClass, prop } from "@typegoose/typegoose";
import { FlattenMaps, Types } from "mongoose";

export class Race {
  private static defaultFields = ['-_id'];

  @prop({ required: true, type: () => Number, unique: true })
  raceId!: number;

  @prop({ required: true, type: () => Number })
  year!: number;

  @prop({ required: true, type: () => String })
  name!: string;

  static async findAll(this: ReturnModelType<typeof Race>): Promise<(FlattenMaps<Race> & {
    _id: Types.ObjectId;
  })[]> {
    return await this.find().lean().select(this.defaultFields);
  }

  static async getNameById(this: ReturnModelType<typeof Race>, raceId: number): Promise<(FlattenMaps<Race> & {
    _id: Types.ObjectId;
  }) | null> {
    return await this.findOne({ raceId }).select(this.defaultFields).select('name').lean();
  }
}

export const RaceModel = getModelForClass(Race);
