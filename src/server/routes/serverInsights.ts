import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { getGuildById } from '../../utils/discord';
import { variables } from '../../variables';
// import { H } from '@highlight-run/node';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const retVal = new ReturnValue();

  const guild = await getGuildById(variables.DISCORD_GUILD_ID);
  if (!guild) {
    retVal.status = 500;
    retVal.body.err = 'Could not find guild';
    return res.status(retVal.status).json(retVal.body);
  }

  const totalMembers = guild.memberCount;
  const onlineMembers = guild.members.cache.filter((member) => {
    const status = member.presence?.status;
    return status !== undefined && status != 'offline' && !member.user.bot;
  }).size;

  retVal.body.data = { totalMembers, onlineMembers };
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
