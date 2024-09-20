import assert from "assert";
import { CustomError } from "../../exceptions/CustomError";
import * as contentModel from "../../models/contentModel";
import * as quizzService from "../../services/quizzService";

jest.mock('../../models/contentModel');

test('Should throw error if request is not valid', async () => {
  const request = { quizzId: 1, quizzOption: "" };
  const payload = { userId: 1 };

  try {
    await quizzService.answerQuizz(request, payload);
  } catch (error) {
    expect(error).toBeInstanceOf(CustomError);
    
    if (error instanceof CustomError) {
      expect(error.message).toBe("Dados insuficientes para responder o quizz");
      expect(error.getStatusCode()).toBe(400);
    }
  }
})

test('Should throw error if quizz does not exist', async () => {
  const request = { quizzId: 1, quizzOption: "Opção 1" };
  const payload = { userId: 1 };
  
  (contentModel.getQuizzById as jest.Mock).mockResolvedValue(null);
  
  try {
    await quizzService.answerQuizz(request, payload);
  } catch (error) {
    expect(error).toBeInstanceOf(CustomError);

    if (error instanceof CustomError) {
      expect(error.message).toBe("Quizz não encontrado na base com id: 1");
      expect(error.getStatusCode()).toBe(404);
    }
  }
})


test('Should throw error if try to respond more than once', async () => {
  const request = { quizzId: 1, quizzOption: "Opção 1" };
  const payload = { userId: 1 };
  const quizz = {
    contentId: 1,
    question: "Questão",
    options: [
      "Opção 1",
      "Opção 2",
      "Opção 3"
    ],
    correctAswer: "Opção 1",
    QuizzAnswer: [{}]
  };

  (contentModel.getQuizzById as jest.Mock).mockResolvedValue(quizz);
  
  try {
    await quizzService.answerQuizz(request, payload);
  } catch (error) {
    expect(error).toBeInstanceOf(CustomError);

    if (error instanceof CustomError) {
      expect(error.message).toBe("Não é possível responder mais de uma vez");
      expect(error.getStatusCode()).toBe(400);
    }
  }
})

test('Should answer quizz question correctly', async () => {
  const request = { quizzId: 1, quizzOption: "Opção 1" };
  const payload = { userId: 1 };
  const quizz = {
    contentId: 1,
    question: "Questão",
    options: [
      "Opção 1",
      "Opção 2",
      "Opção 3"
    ],
    correctAswer: "Opção 1",
    QuizzAnswer: []
  };
  const answer = {
    id: 1,
    isCorrect: true,
    quizzId: 1,
    userId: 1
  };

  (contentModel.getQuizzById as jest.Mock).mockResolvedValue(quizz);
  (contentModel.answerQuizz as jest.Mock).mockResolvedValue(answer);
  
  try {
    const response = await quizzService.answerQuizz(request, payload);

    expect(response).toBe(answer)
  } catch (error) {
    assert(false);
  }
})