import { getRecentShares, getShareToTweet } from '../../db/shares';
import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { getRandomShareFromCache } from '../../utils/shareCache';
import { getTweetFromShare } from '../../tweeter';

const router = express.Router();

router.get('', async (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  try {
    const limit = parseInt(String(req.query.limit)) || 20;
    const random = String(req.query.random) === 'true';
    if (limit > 50) {
      retVal.status == 400;
      retVal.body.err = 'Inavlid request. Limit shoult be less than 50';
    } else {
      if (random) {
        const randomShare = await getRandomShareFromCache();
        retVal.body.data = randomShare;
      } else {
        const recentShares = await getRecentShares(limit);
        retVal.body.data = recentShares;
      }
    }
  } catch (error) {
    console.error(error);
    retVal.status = 500;
    retVal.body.err = 'Something went wrong: (';
  } finally {
    res.status(retVal.status).json(retVal.body);
  }
});

router.get('/nextTweet', async (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  try {
    const share = await getShareToTweet();
    if (!share) {
      retVal.status = 500;
      retVal.body.err = 'Something went wrong: (';
    } else {
      const tweet = await getTweetFromShare(share);
      retVal.body.data = tweet;
      retVal.status = 200;
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
