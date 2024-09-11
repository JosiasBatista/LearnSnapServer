import { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../exceptions/CustomError";
import * as contentModel from "../models/contentModel";
import { Comment, Like } from "@prisma/client";
import { CommentRequest } from "../interfaces/content";

export const getContents = async (page: number, limit: number) => {
  try {
    const contents = await contentModel.getContentList(page, limit);
    return contents;
  } catch (error) {
    throw new CustomError(`${error}`, 500);
  }
}

export const likeContent = async (contentId: number, payload: JwtPayload) => {
  try {
    const likeData: Omit<Like, "id"> = {
      contentId,
      userId: payload.userId
    }

    await contentModel.giveLikeToContent(likeData);

    return contentModel.getContentLikesAmount(contentId);
  } catch (error) {
    throw new CustomError(`${error}`, 500);
  }
}

export const createComment = async (request: CommentRequest, payload: JwtPayload) => {
  try {
    const commentData: Omit<Comment, "id"> = {
      contentId: request.contentId,
      value: request.value,
      userId: payload.userId
    };

    const comment = await contentModel.createComment(commentData);
    
    if (!comment) {
      throw new CustomError("Erro ao criar comentário", 500);
    }
  } catch (error) {
    throw new CustomError(`${error}`, 500);
  }
}