export class JoinRoomDto {
  roomName: string;
  token: string;
}

export class TypingDto {
  roomName: string;
  isTyping: boolean;
}

export class MessageDto {
  roomName: string;
  sender: string;
  content: string;
  token: string;
}
