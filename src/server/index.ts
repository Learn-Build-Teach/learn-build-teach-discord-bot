import express, { Request, Response } from 'express';
import cors from 'cors';
import shareRoutes from './routes/shares';
import kudoRoutes from './routes/kudos';
import userRoutes from './routes/users';
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'https://www.learnbuildteach.com',
  })
);

app.get('/ping', (req: Request, res: Response) => {
  console.info('Server was pinged');
  res.send('Hello World');
});

app.use('/api/shares', shareRoutes);
app.use('/api/kudos', kudoRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`listening on port, ${port}`);
});