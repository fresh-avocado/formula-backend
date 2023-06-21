import { ReturnModelType, Severity, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import mongoose, { FlattenMaps, Types } from "mongoose";

interface Result {
  raceId: number;
  raceName: string;
  driverId: number;
  driverName: string;
  position: number;
}

interface YearlyResult {
  [year: number]: Result[];
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW }
})
export class Constructor {
  private static defaultFields = ['-_id'];

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

  @prop({ type: () => mongoose.Schema.Types.Mixed, select: false })
  yearlyResults!: YearlyResult;

  static async findAll(this: ReturnModelType<typeof Constructor>, extraFields?: (`+${keyof Constructor}`)[]): Promise<(FlattenMaps<Constructor> & {
    _id: Types.ObjectId;
  })[]> {
    if (extraFields !== undefined) {
      return this.find().select(this.defaultFields.concat(extraFields)).lean();
    } else {
      return this.find().select(this.defaultFields).lean();
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
