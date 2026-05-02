const ITUNES_API = 'https://itunes.apple.com/search';

export interface iTunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl?: string;
  trackViewUrl: string;
}

export async function searchTracks(query: string, limit = 5) {
  const params = new URLSearchParams({ term: query, media: 'music', limit: String(limit) });
  const res = await fetch(`${ITUNES_API}?${params}`);
  if (!res.ok) throw new Error(`iTunes API error: ${res.status}`);
  const data = await res.json();
  return (data.results || []).map((r: iTunesResult) => ({
    trackName: r.trackName,
    artistName: r.artistName,
    albumName: r.collectionName,
    artworkUrl: r.artworkUrl100?.replace('100x100', '300x300') || '',
    previewUrl: r.previewUrl || undefined,
    itunesUrl: r.trackViewUrl,
  }));
}
