import dotenv from 'dotenv';
import Twitter from 'twitter';
import axios from 'axios';
dotenv.config();
var twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

export const sendTweet = async (status, imageUrl) => {
    if (!imageUrl) {
        await twitterClient.post('statuses/update', { status });
        console.log('tweet sent', status);
        return;
    }
    const imageData = await getRemoteImageInB64(imageUrl);
    const media = await twitterClient.post('media/upload', {
        media_data: imageData,
    });

    var status = {
        status,
        media_ids: media.media_id_string,
    };
    await twitterClient.post('statuses/update', status);
    console.log('Tweet sent', status);
};

export const getRemoteImageInB64 = async (imageUrl) => {
    try {
        let image = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });
        let returnedB64 = Buffer.from(image.data).toString('base64');
        return returnedB64;
    } catch (err) {
        console.error(err);
        return null;
    }
};
