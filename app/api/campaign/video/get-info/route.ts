import { NextRequest, NextResponse } from 'next/server';



import { IVideo } from '../../../../lib/models/video';


export async function PUT(req: NextRequest) {
  try {
    const { platform, api_key, videoUrl, videoId } = await req.json();

    const url =
      platform === 'Instagram'
        ? `https://instagram-looter2.p.rapidapi.com/post?url=${videoUrl}`
        : platform === 'TikTok'
          ? `https://tiktok-api23.p.rapidapi.com/api/post/detail?videoId=${videoId}`
          : `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}&urlAccess=blocked&videos=false&audios=false`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': api_key,
        'x-rapidapi-host':
          platform === 'Instagram'
            ? 'instagram-looter2.p.rapidapi.com'
            :
          platform === 'TikTok'
              ? 'tiktok-api23.p.rapidapi.com'
              : 'youtube-media-downloader.p.rapidapi.com',
      },
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch video info', details: errorText },
        { status: response.status }
      );
    }

    let parsedBody: any;
    try {
      parsedBody = await response.json();
    } catch (err) {
      const rawText = await response.text();
      console.error('Non-JSON response:', rawText);
      return NextResponse.json(
        { error: 'Invalid JSON from API', raw: rawText },
        { status: 500 }
      );
    }

    let videoInfo: IVideo | null = null;

    if (platform === 'Instagram') {
      const instagramData = parsedBody;

      videoInfo = {
        comments: instagramData.edge_media_to_parent_comment?.count || 0,
        createdAt: new Date(
          instagramData.taken_at_timestamp * 1000
        ).toISOString(),
        likes: instagramData.edge_media_preview_like?.count || 0,
        link: `https://www.instagram.com/p/${instagramData.shortcode}/`,
        name:
          instagramData.edge_media_to_caption?.edges[0]?.node?.text || '',
        accountName: instagramData.owner?.username || '',
        shares: 0,
        views: instagramData.video_play_count || 0,
        coverUrl: instagramData.thumbnail_src || '',
        lastUpdatedAt: new Date(Date.now()).toISOString(),
      };
    } else if (platform === 'TikTok') {
      if (parsedBody.statusCode === 0) {
        const tiktokData = parsedBody.itemInfo.itemStruct;

        videoInfo = {
          comments: tiktokData.stats?.commentCount || 0,
          createdAt: new Date(
            parseInt(tiktokData.createTime) * 1000
          ).toISOString(),
          likes: tiktokData.stats?.diggCount || 0,
          link: `https://www.tiktok.com/@${tiktokData.author?.uniqueId}/video/${tiktokData.id}`,
          name: tiktokData.desc || '',
          accountName: tiktokData.author?.nickname || '',
          shares: tiktokData.stats?.shareCount || 0,
          views: tiktokData.stats?.playCount || 0,
          coverUrl: tiktokData.video.cover || '',
          lastUpdatedAt: new Date(Date.now()).toISOString(),
        };
      }
    } else if (platform === 'YouTube') {
      const youtubeData = parsedBody
      console.log('--- YOUTUBE DATA START ---')
      console.log(JSON.stringify(youtubeData, null, 2))
      console.log('--- YOUTUBE DATA END ---')
      videoInfo = {
        comments: Number(youtubeData.commentCountText) || 0,
        createdAt: new Date(youtubeData.publishedTime).toISOString(),
        likes: youtubeData.likeCount || 0,
        link: `https://www.youtube.com/shorts/${youtubeData.id}`,
        name: youtubeData.title || '',
        accountName: youtubeData.channel?.name || '',
        shares: youtubeData.stats?.shareCount || 0,
        views: youtubeData.viewCount || 0,
        coverUrl: youtubeData.thumbnails[0]?.url || '',
        lastUpdatedAt: new Date(Date.now()).toISOString(),
      }
    } else {
        return NextResponse.json(
          { message: 'Video is deleted or not found!', videoInfo },
          { status: 200 }
        );
      }

    return NextResponse.json(
      { message: 'Successfully got video info.', videoInfo },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting video info:', error);
    return NextResponse.json(
      { error: 'Error getting video info' },
      { status: 500 }
    );
  }
}