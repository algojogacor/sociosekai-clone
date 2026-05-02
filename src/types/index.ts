export interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  title?: string;
  body: string;
  imageUrl?: string;
  music?: MusicEmbed;
  likes: number;
  comments: number;
  shares: number;
}

export interface MusicEmbed {
  trackName: string;
  artistName: string;
  albumName: string;
  artworkUrl: string;
  previewUrl?: string;
  itunesUrl: string;
}

export type TabType = 'posts' | 'blogs';
export type Theme = 'dark' | 'light';
