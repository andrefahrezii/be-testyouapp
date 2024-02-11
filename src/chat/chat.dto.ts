// src/chat/chat.dto.ts

export class JoinRoomDto {
  roomName: string;
}

export class MessageDto {
  roomName: string;
  sender: string;
  content: string;
}
