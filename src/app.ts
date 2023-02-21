//load environment variables
import './variables';
//run the twitch bot
import './bot';

//run the tweeter
import './tweeter';

//run the express server
import './server/index';

//run the event scheduler
import './discordEventScheduler';
import { scheduleWinOfTheWeek } from './discordEventScheduler';

scheduleWinOfTheWeek();
