import { flatten, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { ArticleEntity } from 'src/article/article.entity';
import { ICommentsResponse } from './types/commentsResponse.interface';
import { ICommentResponse } from './types/commentResponse.interface';
import { FollowEntity } from 'src/profile/following.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async createComment(
    user: UserEntity,
    slug: string,
    createCommentDto: CreateCommentDto,
  ): Promise<ICommentResponse> {
    const comment = new CommentEntity();

    const article = await this.findArticleBySlug(slug);

    Object.assign(comment, createCommentDto);

    comment.author = user;
    comment.article = article;

    const savedComment = await this.commentRepository.save(comment);

    let isFollowed = false;

    const follow = await this.followRepository.findOne({
      where: {
        followerId: user.id,
        followingId: article.authorId,
      },
    });

    isFollowed = Boolean(follow);

    return this.generateCommentResponse(savedComment, isFollowed);
  }

  async getComments(
    slug: string,
    currentUserId: number,
  ): Promise<ICommentsResponse> {
    const article = await this.findArticleBySlug(slug);

    const comments = await this.commentRepository.find({
      where: { article: { id: article.id } },
      order: { createdAt: 'DESC' },
    });

    let isFollowed = false;

    if (currentUserId) {
      const follow = await this.followRepository.findOne({
        where: {
          followerId: currentUserId,
          followingId: article.authorId,
        },
      });

      isFollowed = Boolean(follow);
    }

    return this.generateCommentsResponse(comments, isFollowed);
  }

  async deleteComment(
    currentUserId: number,
    slug: string,
    commentId: number,
  ): Promise<string> {
    const article = await this.findArticleBySlug(slug);

    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
        article: { id: article.id },
      },
      relations: ['author'],
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (comment.author.id !== currentUserId) {
      throw new HttpException(
        'You are not the author of this comment',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.commentRepository.remove(comment);

    return 'comment successfully deleted';
  }

  private async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  generateCommentResponse(
    comment: CommentEntity,
    isFollowed: boolean,
  ): ICommentResponse {
    return {
      comment: {
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: {
          username: comment.author.username,
          bio: comment.author.bio,
          image: comment.author.image,
          following: isFollowed,
        },
      },
    };
  }

  generateCommentsResponse(
    comments: CommentEntity[],
    isFollowed: boolean,
  ): ICommentsResponse {
    const formatedComments = comments.map((comment) => ({
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      body: comment.body,
      author: {
        username: comment.author.username,
        bio: comment.author.bio,
        image: comment.author.image,
        following: isFollowed,
      },
    }));

    return { comments: formatedComments };
  }
}
