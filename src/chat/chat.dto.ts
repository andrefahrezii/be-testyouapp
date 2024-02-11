// src/chat/chat.dto.ts

export class JoinRoomDto {
  roomName: string;
  token: string;
}

export class MessageDto {
  roomName: string;
  sender: string;
  content: string;
  token: string;
}
