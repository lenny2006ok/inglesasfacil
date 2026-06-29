import { URLSearchParams } from 'node:url';

export interface YoutubeSearchResult {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  startTime: number;
  durationSeconds: number;
  phrase: string;
}

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const CLIP_DURATION_SECONDS = 15;

function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) {
    return 0;
  }

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  return hours * 3600 + minutes * 60 + seconds;
}

function sanitizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\[.*?\]/g, '')
    .slice(0, 90);
}

export async function searchYoutubeVideos(query: string, maxResults = 6): Promise<YoutubeSearchResult[]> {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return [];
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is not configured');
  }

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: String(maxResults),
    q: searchTerm,
    videoEmbeddable: 'true',
    key: apiKey,
  });

  const searchResponse = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params.toString()}`);

  if (!searchResponse.ok) {
    const errorText = await searchResponse.text();
    throw new Error(`YouTube search failed: ${searchResponse.status} ${errorText}`);
  }

  const searchData = await searchResponse.json() as {
    items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string; description?: string; thumbnails?: { medium?: { url?: string } } } }>;
  };

  const videoIds = (searchData.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((videoId): videoId is string => Boolean(videoId));

  if (videoIds.length === 0) {
    return [];
  }

  const videosParams = new URLSearchParams({
    part: 'snippet,contentDetails',
    id: videoIds.join(','),
    key: apiKey,
  });

  const videosResponse = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${videosParams.toString()}`);

  if (!videosResponse.ok) {
    const errorText = await videosResponse.text();
    throw new Error(`YouTube video details failed: ${videosResponse.status} ${errorText}`);
  }

  const videosData = await videosResponse.json() as {
    items?: Array<{
      id?: string;
      snippet?: { title?: string; channelTitle?: string; description?: string; thumbnails?: { medium?: { url?: string } } };
      contentDetails?: { duration?: string };
    }>;
  };

  return (videosData.items ?? []).map((video) => {
    const durationSeconds = parseDurationToSeconds(video.contentDetails?.duration ?? 'PT0S');
    const clipDuration = Math.min(CLIP_DURATION_SECONDS, durationSeconds || CLIP_DURATION_SECONDS);
    const startTime = durationSeconds > clipDuration ? Math.max(0, Math.floor((durationSeconds - clipDuration) / 2)) : 0;

    return {
      id: video.id ?? '',
      title: sanitizeText(video.snippet?.title ?? 'Vídeo do YouTube'),
      channelTitle: video.snippet?.channelTitle ?? 'YouTube',
      description: sanitizeText(video.snippet?.description ?? ''),
      thumbnailUrl: video.snippet?.thumbnails?.medium?.url ?? '',
      videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
      startTime,
      durationSeconds: clipDuration,
      phrase: sanitizeText(video.snippet?.title ?? searchTerm),
    };
  }).filter((video) => Boolean(video.id));
}
