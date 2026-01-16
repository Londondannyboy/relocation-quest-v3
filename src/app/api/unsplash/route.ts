import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  alt_description: string | null;
  description: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const count = parseInt(searchParams.get('count') || '1', 10);

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  if (!UNSPLASH_ACCESS_KEY) {
    // Return fallback gradient if no API key
    return NextResponse.json({
      images: [{
        url: null,
        fallback: true,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }],
    });
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    const photos: UnsplashPhoto[] = data.results;

    const images = photos.map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      fullUrl: photo.urls.full,
      thumbUrl: photo.urls.small,
      alt: photo.alt_description || photo.description || query,
      credit: {
        name: photo.user.name,
        link: photo.user.links.html,
      },
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Unsplash API error:', error);
    return NextResponse.json({
      images: [{
        url: null,
        fallback: true,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }],
      error: 'Failed to fetch from Unsplash',
    });
  }
}
