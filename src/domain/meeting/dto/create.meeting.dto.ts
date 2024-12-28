export interface CreateMeetingDto {
  name: string;
  explanation: string;
  limit: number;
  thumbnail: string;
  canJoin: boolean;
}
