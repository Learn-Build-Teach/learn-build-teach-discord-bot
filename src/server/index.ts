import express, { Request, Response } from 'express';
import cors from 'cors';
import shareRoutes from './routes/shares';
import kudoRoutes from './routes/kudos';
import jqqnewsletterRoutes from './routes/jqqNewsletter';
import discordUserRoutes from './routes/discordUser';
import serverInsightsRoutes from './routes/serverInsights';
import { variables } from '../variables';
import { H, Handlers } from '@highlight-run/node';

H.init({ projectID: variables.HIGHLIGHT_PROJECT_ID || '' });

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

app.get('/ping', (req: Request, res: Response) => {
  console.info('Server was pinged');
  res.send('Hello World');
});

app.use('/api/shares', shareRoutes);
app.use('/api/kudos', kudoRoutes);
app.use('/api/discordUsers', discordUserRoutes);
app.use('/api/jqqnewsletter', jqqnewsletterRoutes);
app.use('/api/server-insights', serverInsightsRoutes);

const highlightErrorHandler = Handlers.errorHandler({
  projectID: variables.HIGHLIGHT_PROJECT_ID || '',
});

app.use(highlightErrorHandler);

const port = variables.PORT || 3000;

app.listen(port, () => {
  console.info(`listening on port, ${port}`);
});
