import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { discordClient } from '../../utils/discord';
import { H } from '@highlight-run/node';
const router = express.Router();

const getMembers = function () {
  let totalMembers = 0;
  discordClient.guilds.cache.forEach((guild) => {
    totalMembers += guild.memberCount;
  });
  if (Math.random() < 0.5) {
    throw new Error("James's code sucks");
  }
  return totalMembers;
};

router.get('/', (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  retVal.body.data = { totalMembers: getMembers() };
  res.status(retVal.status).json(retVal.body);
});

router.get('/async', async (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  try {
    retVal.body.data = { totalMembers: getMembers() };
  } catch (error) {
    console.error(error);
    retVal.status = 500;
    retVal.body.err = 'Something went wrong :(';
    const parsedHeaders = H.parseHeaders(req.headers);
    H.consumeError(
      error as Error,
      parsedHeaders?.secureSessionId,
      parsedHeaders?.requestId
    );
  } finally {
    res.status(retVal.status).json(retVal.body);
  }
});

export default router;
