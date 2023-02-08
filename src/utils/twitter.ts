import dotenv from 'dotenv';
import Twitter from 'twitter';
import axios from 'axios';
import { variables } from '../variables';
dotenv.config();
const twitterClient = new Twitter({
  consumer_key: variables.TWITTER_CONSUMER_KEY || '',
  consumer_secret: variables.TWITTER_CONSUMER_SECRET || '',
  access_token_key: variables.TWITTER_ACCESS_TOKEN_KEY || '',
  access_token_secret: variables.TWITTER_ACCESS_TOKEN_SECRET || '',
});

export const sendTweet = async (status: string, imageUrl?: string) => {
  if (!imageUrl) {
    await twitterClient.post('statuses/update', { status });
    console.info('tweet sent', status);
    return;
  }
  const imageData = await getRemoteImageInB64(imageUrl);
  const media = await twitterClient.post('media/upload', {
    media_data: imageData,
  });

  const statusWithImage = {
    status,
    media_ids: media.media_id_string,
  };
  await twitterClient.post('statuses/update', statusWithImage);
  console.info('Tweet sent', status);
};

export const getRemoteImageInB64 = async (imageUrl: string) => {
  try {
    const image = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    const returnedB64 = Buffer.from(image.data).toString('base64');
    return returnedB64;
  } catch (err) {
    console.error(err);
    return null;
  }
};
