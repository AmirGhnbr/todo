import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { NotificationUseCases } from '../../application/notification/notification.use-cases';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CreateNotificationDto, NotificationResponseDto } from '../dto/notification.dto';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notifications: NotificationUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create notification for current user' })
  @ApiResponse({ status: 201, type: NotificationResponseDto })
  async create(@Req() req: Request, @Body() dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const userId = (req as any).user.userId as string;
    const notification = await this.notifications.createForUser({
      userId,
      title: dto.title,
      message: dto.message,
      relatedTodoId: dto.relatedTodoId ?? null,
    });

    return this.toDto(notification);
  }

  @Get('unread')
  @ApiOperation({ summary: 'List unread notifications for current user' })
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  async listUnread(@Req() req: Request): Promise<NotificationResponseDto[]> {
    const userId = (req as any).user.userId as string;
    const items = await this.notifications.listUnreadForUser(userId);
    return items.map((n) => this.toDto(n));
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async markAsRead(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<NotificationResponseDto | null> {
    const userId = (req as any).user.userId as string;
    const notification = await this.notifications.markAsRead(userId, id);
    return notification ? this.toDto(notification) : null;
  }

  private toDto(notification: any): NotificationResponseDto {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
      readAt: notification.readAt ? notification.readAt.toISOString() : null,
      relatedTodoId: notification.relatedTodoId,
    };
  }
}
