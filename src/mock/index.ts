import { Article } from "../interfaces/content";
import { Educator } from "../interfaces/user";

export const educator1: Educator = {
  id: 1,  
  name: "Josias Abraão",
  email: "josias.leal@ccc.ufcg.edu.br",
  contentsPosted: 1,
  field: "Development"
}

export const educator2: Educator = {
  id: 2,
  name: "John Doe",
  email: "john.doe@ccc.ufcg.edu.br",
  contentsPosted: 1,
  field: "Marketing"
}

export const educatorsMock: Educator[] = [educator1, educator2];

export const articlesMock: Article[] = [
    {
        id: 1,
        title: "Desenvolvimento Web Josias 1",
        article: "O desenvolvimento web é uma área da programção que tem crescido bastante...",
        author: educator1
    },
    {
        id: 2,
        title: "Desenvolvimento Web Josias 2",
        article: "O desenvolvimento web é uma área da programção que tem crescido bastante...",
        author: educator1
    },
    {
        id: 3,
        title: "Desenvolvimento Web John 1",
        article: "O desenvolvimento web é uma área da programção que tem crescido bastante...",
        author: educator2
    },
    {
        id: 4,
        title: "Desenvolvimento Web John 2",
        article: "O desenvolvimento web é uma área da programção que tem crescido bastante...",
        author: educator2
    }
]