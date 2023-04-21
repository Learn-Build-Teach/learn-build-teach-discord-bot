import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { discordClient } from '../../utils/discord';
// import { H } from '@highlight-run/node';
const router = express.Router();

const getMembers = function () {
  let totalMembers = 0;
  discordClient.guilds.cache.forEach((guild) => {
    totalMembers += guild.memberCount;
  });
  return totalMembers;
};

router.get('/', (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  retVal.body.data = { totalMembers: getMembers() };
  res.status(retVal.status).json(retVal.body);
});

//Error handling manually with highlight for async callbacks
// const parsedHeaders = H.parseHeaders(req.headers);
//     H.consumeError(
//       error as Error,
//       parsedHeaders?.secureSessionId,
//       parsedHeaders?.requestId
//     );

export default router;
