import { Article } from "../interfaces/article";
import { Educator } from "../interfaces/user";

export const Educator1: Educator = {
    name: "Josias Abraão",
    email: "josias.leal@ccc.ufcg.edu.br",
    contentsPosted: 1,
    field: "Development"
}

export const Educator2: Educator = {
    name: "John Doe",
    email: "john.doe@ccc.ufcg.edu.br",
    contentsPosted: 1,
    field: "Marketing"
}

export const ArticlesMock: Article[] = [
    {
        id: 1,
        title: "Desenvolvimento Web Josias 1",
        article: "O desenvolvimento web é uma área da programção que tem crescido bastante...",
        author: Educator1
    },
    {
        id: 2,
        title: "Desenvolvimento Web Josias 2",
        article: "O desenvolvimento web é uma área da programção que tem crescido bastante...",
        author: Educator1
    },
    {
        id: 3,
        title: "Desenvolvimento Web John 1",
        article: "O desenvolvimento web é uma área da programção que tem crescido bastante...",
        author: Educator2
    },
    {
        id: 4,
        title: "Desenvolvimento Web John 2",
        article: "O desenvolvimento web é uma área da programção que tem crescido bastante...",
        author: Educator2
    }
]