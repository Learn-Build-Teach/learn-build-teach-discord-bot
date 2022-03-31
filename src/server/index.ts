import express, { Request, Response } from 'express';
import shareRoutes from './routes.ts/shares';
import kudoRoutes from './routes.ts/kudos';
const app = express();

app.get('/ping', (req: Request, res: Response) => {
  console.info('Server was pinged');
  res.send('Hello World');
});

app.use('/api/shares', shareRoutes);
app.use('/api/kudos', kudoRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`listening on port, ${port}`);
});
