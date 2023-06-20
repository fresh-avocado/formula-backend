import { ReturnModelType, getModelForClass, prop } from "@typegoose/typegoose";
import { FlattenMaps, Types } from "mongoose";

export class Constructor {
  private static defaultFields = ['-_id', '-__v'];

  @prop({ required: true, type: () => Number, unique: true })
  constructorId!: number;

  @prop({ required: true, type: () => String })
  name!: string;

  @prop({ required: true, type: () => String, select: false })
  constructorRef!: string;

  @prop({ required: true, type: () => String, select: false })
  nationality!: string;

  @prop({ required: true, type: () => String, select: false })
  url!: string;

  @prop({ type: () => Boolean, default: false })
  isFavorite?: boolean;

  static async findAll(this: ReturnModelType<typeof Constructor>, extraFields?: (keyof Constructor)[]): Promise<(FlattenMaps<Constructor> & {
    _id: Types.ObjectId;
  })[]> {
    if (extraFields !== undefined) {
      return this.find().lean().select(this.defaultFields.concat(extraFields));
    } else {
      return this.find().lean().select(this.defaultFields);
    }
  }

  static async updateIsFavorite(this: ReturnModelType<typeof Constructor>, constructorId: number, isFavorite: boolean): Promise<void> {
    // no need for Doc to be hydrated nor populated
    const res = await this.findOneAndUpdate({ constructorId }, { isFavorite }).lean().select([]);
    if (res === null) {
      throw new Error(`constructor with constructorId = ${constructorId} does not exist`);
    } else {
      return;
    }
  }
}

export const ConstructorModel = getModelForClass(Constructor);
