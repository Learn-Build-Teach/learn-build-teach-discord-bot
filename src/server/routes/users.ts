import { ReturnValue } from '../models';
import express, { Request, Response } from 'express';
import { checkAPIKey } from '../middleware';
import { getUserById, upsertUser } from '../../db/users';
import { User } from '@prisma/client';

const router = express.Router();

router.get('/:id', checkAPIKey, async (req: Request, res: Response) => {
  const retVal = new ReturnValue();
  const id = req.params.id;

  try {
    const user = await getUserById(id);

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
  const user: User = req.body;
  try {
    const updatedUser = await upsertUser(user);
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
