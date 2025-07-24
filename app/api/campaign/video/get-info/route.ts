import { IVideo } from '../../../../lib/models/video'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  try {
    const {platform, api_key, videoId} = await req.json();
    const url = platform === 'Instagram'
        ? `https://instagram-looter2.p.rapidapi.com/post?id=${videoId}`
        : `https://tiktok-api23.p.rapidapi.com/api/post/detail?videoId=${videoId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': api_key,
        'x-rapidapi-host':
          platform === 'Instagram'
            ? 'instagram-looter2.p.rapidapi.com'
            : 'tiktok-api23.p.rapidapi.com',
      },
    });
    const parsedBody = await response.json();

    let videoInfo: IVideo | null = null;

    if (platform === 'Instagram') {
      const instagramData = parsedBody;

      videoInfo = {
        comments: instagramData.edge_media_to_parent_comment?.count || 0,
        createdAt: new Date(instagramData.taken_at_timestamp * 1000).toISOString(),
        likes: instagramData.edge_media_preview_like?.count || 0,
        link: `https://www.instagram.com/p/${instagramData.shortcode}/`,
        name: instagramData.edge_media_to_caption?.edges[0]?.node?.text || '',
        accountName: instagramData.owner?.username || '',
        shares: 0,
        views: instagramData.video_play_count || 0,
        coverUrl: instagramData.thumbnail_src || '',

      };
    } else if (platform === 'TikTok') {
      const tiktokData = parsedBody.itemInfo.itemStruct;

      videoInfo = {
        comments: tiktokData.stats?.commentCount || 0,
        createdAt: new Date(parseInt(tiktokData.createTime) * 1000).toISOString(),
        likes: tiktokData.stats?.diggCount || 0,
        link: `https://www.tiktok.com/@${tiktokData.author?.uniqueId}/video/${tiktokData.id}`,
        name: tiktokData.desc || '',
        accountName: tiktokData.author?.nickname || '',
        shares: tiktokData.stats?.shareCount || 0,
        views: tiktokData.stats?.playCount || 0,
        coverUrl: tiktokData.video.cover || '',
      };
    }

    return NextResponse.json({ message: 'Successfully get video info.', videoInfo }, {status: 200});
  } catch (error) {
    console.error('Error getting video info:', error);
    return NextResponse.json({ error: "Error getting video info" }, {status: 500});
  }
}