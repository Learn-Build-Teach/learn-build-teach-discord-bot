import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { checkAPIKey } from '../middleware';
import { getDiscordUserById, updateDiscordUser } from '../../db/discordUser';
import { DiscordUser } from '../../types/types';

const router = express.Router();

router.get('/:id', checkAPIKey, async (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  const id = req.params.id;

  try {
    const user = await getDiscordUserById(id);

    retVal.body.data = user;
    if (!user) {
      retVal.status = 404;
      retVal.body.err = 'User not found';
    }
  } catch (error) {
    console.error(error);
    retVal.status = 500;
    retVal.body.err = 'Something went wrong :(';
  } finally {
    res.status(retVal.status).json(retVal.body);
  }
});

router.patch('/:id', checkAPIKey, async (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  const user: DiscordUser = req.body;
  try {
    const updatedUser = await updateDiscordUser(user.id, user);
    retVal.body.data = updatedUser;
  } catch (error) {
    console.error(error);
    retVal.status = 500;
    retVal.body.err = 'Something went wrong :(';
  } finally {
    res.status(retVal.status).json(retVal.body);
  }
});

export default router;
