import { CustomError } from "../exceptions/CustomError";
import { getContentList } from "../models/contentModel";

export const getContents = async (page: number, limit: number) => {
  try {
    const contents = await getContentList(page, limit);
    return contents;
  } catch (error) {
    throw new CustomError(`${error}`, 500);
  }
}