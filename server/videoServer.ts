import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { storage } from './storage';

export interface VideoRoomData {
  id: string;
  name: string;
  hostId: string;
  participants: string[];
  isActive: boolean;
  createdAt: Date;
}

export class VideoServer {
  private io: SocketIOServer;
  private rooms: Map<string, VideoRoomData> = new Map();
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join room
      socket.on('join-room', async (data: { roomId: string; userId: string; userName: string; isHost: boolean }) => {
        const { roomId, userId, userName, isHost } = data;
        
        // Store user socket mapping
        this.userSockets.set(userId, socket.id);
        
        // Join socket room
        socket.join(roomId);
        
        // Get or create room
        let room = this.rooms.get(roomId);
        if (!room) {
          room = {
            id: roomId,
            name: `Room ${roomId}`,
            hostId: isHost ? userId : '',
            participants: [],
            isActive: true,
            createdAt: new Date()
          };
          this.rooms.set(roomId, room);
        }
        
        // Add participant to room
        if (!room.participants.includes(userId)) {
          room.participants.push(userId);
        }
        
        // Notify others in room
        socket.to(roomId).emit('user-joined', {
          userId,
          userName,
          isHost,
          participantCount: room.participants.length
        });
        
        // Send room info to joining user
        socket.emit('room-joined', {
          roomId,
          participants: room.participants,
          isHost
        });
        
        console.log(`User ${userName} joined room ${roomId}`);
      });

      // Handle WebRTC signaling
      socket.on('offer', (data: { to: string; offer: any }) => {
        const targetSocketId = this.userSockets.get(data.to);
        if (targetSocketId) {
          socket.to(targetSocketId).emit('offer', {
            from: socket.id,
            offer: data.offer
          });
        }
      });

      socket.on('answer', (data: { to: string; answer: any }) => {
        const targetSocketId = this.userSockets.get(data.to);
        if (targetSocketId) {
          socket.to(targetSocketId).emit('answer', {
            from: socket.id,
            answer: data.answer
          });
        }
      });

      socket.on('ice-candidate', (data: { to: string; candidate: any }) => {
        const targetSocketId = this.userSockets.get(data.to);
        if (targetSocketId) {
          socket.to(targetSocketId).emit('ice-candidate', {
            from: socket.id,
            candidate: data.candidate
          });
        }
      });

      // Handle media stream updates
      socket.on('stream-update', (data: { roomId: string; userId: string; isVideoEnabled: boolean; isAudioEnabled: boolean }) => {
        socket.to(data.roomId).emit('stream-updated', data);
      });

      // Handle screen sharing
      socket.on('screen-share-start', (data: { roomId: string; userId: string }) => {
        socket.to(data.roomId).emit('screen-share-started', data);
      });

      socket.on('screen-share-stop', (data: { roomId: string; userId: string }) => {
        socket.to(data.roomId).emit('screen-share-stopped', data);
      });

      // Handle chat messages
      socket.on('chat-message', (data: { roomId: string; userId: string; userName: string; message: string }) => {
        const messageData = {
          id: Date.now().toString(),
          senderId: data.userId,
          senderName: data.userName,
          message: data.message,
          timestamp: new Date().toISOString(),
          type: 'text' as const
        };
        
        this.io.to(data.roomId).emit('chat-message', messageData);
      });

      // Handle room management
      socket.on('mute-user', (data: { roomId: string; targetUserId: string; muted: boolean }) => {
        const targetSocketId = this.userSockets.get(data.targetUserId);
        if (targetSocketId) {
          socket.to(targetSocketId).emit('user-muted', { muted: data.muted });
        }
      });

      socket.on('remove-user', (data: { roomId: string; targetUserId: string }) => {
        const targetSocketId = this.userSockets.get(data.targetUserId);
        if (targetSocketId) {
          socket.to(targetSocketId).emit('user-removed', { reason: 'Removed by host' });
        }
      });

      // Handle recording
      socket.on('start-recording', (data: { roomId: string; userId: string }) => {
        this.io.to(data.roomId).emit('recording-started', { startedBy: data.userId });
      });

      socket.on('stop-recording', (data: { roomId: string; userId: string }) => {
        this.io.to(data.roomId).emit('recording-stopped', { stoppedBy: data.userId });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        // Find and remove user from rooms
        for (const [roomId, room] of this.rooms.entries()) {
          const userId = Array.from(this.userSockets.entries()).find(([_, socketId]) => socketId === socket.id)?.[0];
          if (userId && room.participants.includes(userId)) {
            room.participants = room.participants.filter(id => id !== userId);
            this.userSockets.delete(userId);
            
            // Notify others
            socket.to(roomId).emit('user-left', {
              userId,
              participantCount: room.participants.length
            });
            
            // If room is empty, remove it
            if (room.participants.length === 0) {
              this.rooms.delete(roomId);
            }
            break;
          }
        }
      });
    });
  }

  public getRooms(): VideoRoomData[] {
    return Array.from(this.rooms.values());
  }

  public getRoom(roomId: string): VideoRoomData | undefined {
    return this.rooms.get(roomId);
  }

  public closeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      this.io.to(roomId).emit('room-closed', { reason: 'Room closed by host' });
      this.rooms.delete(roomId);
    }
  }
} 