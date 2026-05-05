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

export interface Room {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  body: string;
  author_name: string;
  created_at: string;
}

export type TabType = 'posts' | 'blogs';
export type Theme = 'dark' | 'light';
