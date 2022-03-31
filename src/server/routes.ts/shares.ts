import { getRecentShares } from '../../db/shares';
import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { checkAPIKey } from '../middleware';

const router = express.Router();

router.get('', checkAPIKey, async (req: Request, res: Response) => {
  console.log(req.headers);
  const retVal = new ReturnValue();
  try {
    const limit = parseInt(String(req.query.limit)) || 20;
    if (limit > 50) {
      retVal.status == 400;
      retVal.body.err = 'Inavlid request. Limit shoult be less than 50';
    } else {
      const recentShares = await getRecentShares(limit);
      retVal.body.data = recentShares;
    }
  } catch (error) {
    console.error(error);
    retVal.status = 500;
    retVal.body.err = 'Something went wrong: (';
  } finally {
    res.status(retVal.status).json(retVal.body);
  }
});

export default router;
