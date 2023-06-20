import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateQueryParams = <T>(schema: Joi.ObjectSchema<T>): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query, { abortEarly: true });
    if (error) {
      res.status(400).json({ msg: error.message }).end();
    } else {
      next();
    }
  }
};

export const validateBody = <T>(schema: Joi.ObjectSchema<T>): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      res.status(400).json({ msg: error.message }).end();
    } else {
      next();
    }
  }
};