import Groq from "groq-sdk";
import { createAiArticle } from "./articleService";
import { createAiQuizz } from "./quizzService";
import { createAiQuote } from "./quoteService";
import { getAreaByNameOrCreate } from "./areaService";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const createContentBasedOnLink = async (link: string, searchText: string) => {
  const chatCompletion = await getGroqChatCompletion(link);
  // Print the completion returned by the LLM.
  const aiChatResponse = chatCompletion.choices[0]?.message?.content ?? "";

  console.log(aiChatResponse)
  if (aiChatResponse) {
    const parsedResponse = JSON.parse(aiChatResponse);

    const areaSaved = await getAreaByNameOrCreate(
      String(searchText).charAt(0).toUpperCase() + String(searchText).slice(1));

    const contentCreationCalls = [];
    parsedResponse.article && contentCreationCalls.push(
      () => createAiArticle({...parsedResponse.article, areaId: areaSaved.id, link}));

    parsedResponse.quizz && contentCreationCalls.push(
      () => createAiQuizz({...parsedResponse.quizz, areaId: areaSaved.id}));

    parsedResponse.quote && contentCreationCalls.push(
      () => createAiQuote({...parsedResponse.quote, areaId: areaSaved.id}));

    await Promise.all(contentCreationCalls.map(fn => fn())).then(() => {
      console.log("Automatic content created")
    }).catch(() => {
      console.log("Error creating automatic content")
    })
  
  }
}

export async function getGroqChatCompletion(link: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Com base no seguinte link de artigo do medium que vou passar, 
        assimile os conhecimentos e com base nisso, desenvolva novos breves artigos que 
        possuam no máximo 5000 caracteres com título e um texto mais aprofundado sobre o tema, 
        notícias acerca do que foi abordado, quizzes sobre os conhecimentos ou citações 
        importantes do texto passado:

        Link:
        ${link}
        
        Traga a resposta no formato JSON com o seguinte padrão:
        {
          "article": {
            "title": "",
            "description": ""
          },
          "quote": {
            "description": "",
            "quoteAuthor": ""
          },
          "quizz": {
            "question": "",
            "option1": "",
            "option2": "",
            "option3": "",
            "correctAnswer": ""
          }
        }
        `,
      },
    ],
    model: "llama3-groq-70b-8192-tool-use-preview",
  });
}