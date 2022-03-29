import express, { Request, Response } from 'express';
const app = express();

app.get('/ping', (req: Request, res: Response) => {
  console.info('Server was pinged');
  res.send('Hello World');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`listening on port, ${port}`);
});
