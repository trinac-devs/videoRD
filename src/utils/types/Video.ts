export interface Video {
  id: string;
  userId: string;
  mainVideoUrl: string;
  processing: boolean;
  videoPathId: string;
  videoName: string;

  shortUrl: string;
  streamingUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAT: string;
}
