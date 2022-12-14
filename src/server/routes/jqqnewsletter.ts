import express, { Request, Response } from 'express';
import { generateNewsletterHTML } from '../../utils/jqqNewsletter';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const newsletterHTML = await generateNewsletterHTML();
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(newsletterHTML);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

export default router;
