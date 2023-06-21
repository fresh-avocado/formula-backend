import { ReturnModelType, Severity, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import mongoose, { FlattenMaps, Types } from "mongoose";

type Result = {
  raceId: number;
  raceName: string;
  driverId: number;
  driverName: string;
  position: number;
}

type YearlyResult = {
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

  @prop({ required: true, type: () => String })
  constructorRef!: string;

  @prop({ required: true, type: () => String })
  nationality!: string;

  @prop({ required: true, type: () => String })
  url!: string;

  @prop({ type: () => Boolean, default: false })
  isFavorite?: boolean;

  @prop({ type: () => mongoose.Schema.Types.Mixed })
  yearlyResults!: YearlyResult;

  static async findAll(this: ReturnModelType<typeof Constructor>, extraFields?: (keyof Constructor)[]): Promise<(FlattenMaps<Constructor> & {
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

  static async addResult(this: ReturnModelType<typeof Constructor>, { constructorId, year, result }: { constructorId: number, year: number, result: Result }): Promise<Constructor> {
    try {
      const res = await this.findOneAndUpdate({ constructorId }, { $push: { [`yearlyResults.${year}`]: result } }, { new: true }).lean();
      return res as Constructor;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  static async getResults(this: ReturnModelType<typeof Constructor>, { constructorId, year }: { constructorId: number, year: number }): Promise<Result[]> {
    const res = await this.findOne({ constructorId }).select(this.defaultFields.concat([`yearlyResults.${year}`])).lean();
    if (res !== null) {
      return res.yearlyResults[year];
    } else {
      throw new Error(`could not find Constructor with constructorId = ${constructorId}`);
    }
  }
}

export const ConstructorModel = getModelForClass(Constructor);
