//load environment variables
import './variables';
//run the twitch bot
import './bot';

//run the tweeter
import './tweeter';

//run the express server
import './server/index';
import { sendEmailAlert } from './utils/email';

sendEmailAlert('Test', 'Testing sstuff');
