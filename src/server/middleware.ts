import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ReturnValue } from './models';
import { variables } from '../variables';
dotenv.config();
const API_KEY_HEADER_NAME = 'x-api-key';

export const checkAPIKey = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const keyFromHeader = req.headers[API_KEY_HEADER_NAME];
  if (!keyFromHeader || keyFromHeader !== variables.SERVER_API_KEY) {
    const retVal = new ReturnValue();
    retVal.status = 401;
    retVal.body.err = 'Unauthorized';
    return res.status(retVal.status).json(retVal.body);
  }
  next();
};
