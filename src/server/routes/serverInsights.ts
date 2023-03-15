import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { discordClient } from '../../utils/discord';
const router = express.Router();

router.get('/', async (_: Request, res: Response) => {
  const retVal = new ReturnValue();
  let totalMembers = 0;
  discordClient.guilds.cache.forEach((guild) => {
    totalMembers += guild.memberCount;
  });
  try {
    retVal.body.data = { totalMembers };
  } catch (error) {
    console.error(error);
    retVal.status = 500;
    retVal.body.err = 'Something went wrong :(';
  } finally {
    res.status(retVal.status).json(retVal.body);
  }
});

export default router;
