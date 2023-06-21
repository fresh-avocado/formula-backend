import Joi from "joi";

export type GetConstructorsQuery = {
  q: string;
}

export const getConstructorsQuerySchema = Joi.object<GetConstructorsQuery>({
  q: Joi.string().min(2).max(20).required(),
});

export type UpdateFavoriteBody = {
  constructorId: number;
  fav: boolean;
}

export const updateFavoriteBodySchema = Joi.object<UpdateFavoriteBody>({
  constructorId: Joi.number().min(1).required(),
  fav: Joi.boolean().required(),
});
