import Parser from 'rss-parser';
import { getSharesForNewsletter } from '../db/shares';
import { variables } from '../variables';
import axios from 'axios';
const parser: Parser = new Parser({});
const COMPRESSEDFM_RSS_FEED_URL = 'https://www.compressed.fm/rss.xml';

export const generateNewsletterHTML = async () => {
  const recentShares = await getSharesForNewsletter();
  const compressedFeed = await parser.parseURL(COMPRESSEDFM_RSS_FEED_URL);
  const recentCompressedEpisode = compressedFeed.items[0];
  const recentYouTubeVideos = await getRecentYouTubeVideos();
  const newsletterHTML = `
  <h1>Recent Videos</h1>
${recentYouTubeVideos
  .map(
    (video: any) => `
<h2><a href="${video.id}">${video.title}</a></h2>
<img src="${video.thumbnails.high.url}"/>
`
  )
  .join('')}
<br />

<h1>TikTok of the Week</h1>
<p>Describe the TikTok</p>
<p><a href="">Watch the full video</a></p>
<br />

<h1>Content From the #LearnBuildTeach Community</h1>
<p>
  <em><strong>Learn Build Teach</strong></em> is a personal philosophy and community.
  Here's the latest content from our <a href="https://learnbuildteach.com/"
    >Discord community</a
  >.
</p>
<ul>
${recentShares
  .map(
    (share) => `
<li><a href="${share.link}">${share.title}</a> by ${share.user.username}</li>
`
  )
  .join('')}
</ul>
<br />
<p>
  Want to share your work and learn from others? <a
    href="https://discord.gg/vM2bagU">Join the community</a
  >
</p>
<br />

<h1>Latest Episode of Compressed.fm - ${recentCompressedEpisode.title}</h1>
<p>${recentCompressedEpisode.content}</p>
<p><a href=${recentCompressedEpisode.link}>Listen to the full episode</a></p>
<br />
<h1>Want to Stay Connected?</h1>
<ul>
  <li>
    Follow me on <a href="https://twitter.com/jamesqquick">Twitter</a> and <a
      href="https://www.tiktok.com/@jamesqquick">TikTok</a
    >
  </li>
  <li>
    Join the <a href="https://learnbuildteach.com/">Learn Build Teach Discord</a
    >
  </li>
  <li>
    Subscribe to my <a href="https://www.youtube.com/c/jamesqquick"
      >YouTube Channel</a
    >
  </li>
</ul>
`;
  return newsletterHTML;
};

const getRecentYouTubeVideos = async () => {
  const YOUTUBE_VIDEOS_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC-T8W79DN6PBnzomelvqJYw&maxResults=10&order=date&type=video&key=${variables.YOUTUBE_API_KEY}`;
  const {
    data: { items },
  } = await axios(YOUTUBE_VIDEOS_URL);
  const formattedYouTubeVideos = items?.map((video: any) => ({
    id: video.id.videoId,
    title: video.snippet.title,
    thumbnails: video.snippet.thumbnails,
  }));

  return formattedYouTubeVideos;
};
