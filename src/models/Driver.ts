import { ReturnModelType, getModelForClass, prop } from "@typegoose/typegoose";
import { FlattenMaps, Types } from "mongoose";

export class Driver {
  private static defaultFields = ['-_id'];

  @prop({ required: true, type: () => Number, unique: true })
  driverId!: number;

  @prop({ required: true, type: () => String })
  foreName!: string;

  @prop({ required: true, type: () => String })
  surName!: string;

  @prop({ required: true, type: () => String })
  dateOfBirth!: string;

  @prop({ required: true, type: () => String }) // ideally, it should be an enum
  nationality!: string;

  static async findAll(this: ReturnModelType<typeof Driver>): Promise<(FlattenMaps<Driver> & {
    _id: Types.ObjectId;
  })[]> {
    return await this.find().lean().select(this.defaultFields);
  }
}

export const DriverModel = getModelForClass(Driver);
