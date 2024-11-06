import { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../exceptions/CustomError";
import * as contentModel from "../models/contentModel";
import * as aiService from "./aiService";
import { findUserById } from "./userService";
import { Comment, Like } from "@prisma/client";
import { CommentRequest } from "../interfaces/content";
import { getAreaByNameOrCreate } from "./areaService";

export const getContents = async (page: number, limit: number, payload: JwtPayload) => {
  const user = await findUserById(payload.userId);
  const areasOfInterest = user?.areasOfInterest.map(area => area.areaId);
  if (user?.mainArea?.id) {
    areasOfInterest?.push(user?.mainArea?.id);
  }

  try {
    const contents = await contentModel.getContentList(page, limit, payload.userId, areasOfInterest || []);
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

    const like = await contentModel.giveLikeToContent(likeData);
    const likeAmount = await contentModel.getContentLikesAmount(contentId);
    
    return { 
      likeAmount,
      like 
    };
  } catch (error) {
    throw new CustomError(`${error}`, 500);
  }
}

export const unlikeContent = async (likeId: number, payload: JwtPayload) => {
  try {
    const like = await contentModel.getLikeById(likeId);

    if (like?.userId !== payload.userId) {
      throw new CustomError("Você não tem permissão para remover o like", 400);
    }
    
    await contentModel.removeLikeFromContent(likeId);
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

export const getCommentsFromContent = async (contentId: number) => {
  return contentModel.getCommentsFromContent(contentId);
}

export const automaticallyCreateContent = async (capturedLists: { Posts: any[] } | null, searchText: string) => {
  if (capturedLists?.Posts) {
    const areaSaved = await getAreaByNameOrCreate(
      String(searchText).charAt(0).toUpperCase() + String(searchText).slice(1));

    capturedLists.Posts.forEach(async (post) => {
      await aiService.createContentBasedOnLink(post.Link, areaSaved);
    })
  }
}