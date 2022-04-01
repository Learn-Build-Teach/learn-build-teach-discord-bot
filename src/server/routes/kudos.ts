import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { checkAPIKey } from '../middleware';
import { getKudosLeaderboard } from '../../db/kudos';

const router = express.Router();

router.get('/leaderboard', checkAPIKey, async (req: Request, res: Response) => {
  const retVal = new ReturnValue();

  try {
    const leaderboard = await getKudosLeaderboard();
    retVal.body.data = leaderboard;
  } catch (error) {
    console.error(error);
    retVal.status = 500;
    retVal.body.err = 'Something went wrong :(';
  } finally {
    res.status(retVal.status).json(retVal.body);
  }
});

export default router;
