import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from 'src/user/decorator/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { AuthGuard } from 'src/user/guards/user.guard';
import { ICommentsResponse } from './types/commentsResponse.interface';
import { CommentEntity } from './comment.entity';
import { ICommentResponse } from './types/commentResponse.interface';

@Controller('articles')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':slug/comments')
  async getComments(@Param('slug') slug: string): Promise<ICommentsResponse> {
    const comments = { comments: [new CommentEntity()] };
    return comments;
  } //Promise<ICommentsResponse>//

  @Post(':slug/comments')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createComment(
    @User() user: UserEntity,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<ICommentResponse> {
    const comment = await this.commentService.createComment(
      user,
      slug,
      createCommentDto,
    );
    return comment;
  }
}
