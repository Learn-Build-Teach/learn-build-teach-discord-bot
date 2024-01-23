import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { discordClient } from '../../utils/discord';
const router = express.Router();

const getEvents = async function () {
  let events: any = [];
  discordClient.guilds.cache.forEach(async (guild) => {
    events = guild.scheduledEvents.cache.map((event) => {
      return { ...event, url: event.url };
    });
  });
  return events;
};

router.get('/', async (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  const events = await getEvents();
  retVal.body.data = { events };
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
