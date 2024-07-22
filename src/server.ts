import express, { Request, Response } from 'express';
import { articlesMock, educatorsMock } from './mock';
import { Article, ArticleRequest } from './interfaces/article';
import { getEducatorById, getArticleById } from './services';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/article/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const article: Article = getArticleById(id);

    res.status(200).send(article);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    } else {
      res.status(400).send('There is an error in your request');
    }

    return;
  }
})

app.post('/article', (req: Request, res: Response) => {
  const articleRequest: ArticleRequest = req.body;

  try {
    const educator = getEducatorById(articleRequest.educatorId);
    const article: Article = {
      id: articlesMock.length + 1,
      title: articleRequest.title,
      article: articleRequest.article,
      author: educator
    };
  
    articlesMock.push(article);
  
    res.status(201).send(article);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    } else {
      res.status(400).send('There is an error in your request');
    }

    return;
  }
})

app.patch('/article/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const articleUpdated: ArticleRequest = req.body;

  const articleIndex = articlesMock.findIndex(article => article.id === Number(id));

  try {
    const educator = getEducatorById(articleUpdated.educatorId);
    if (articleIndex === -1) {
      res.status(400).send(`Article not found with id ${id}`)
      return;
    }

    articlesMock[articleIndex] = {
      ...articlesMock[articleIndex],
      title: articleUpdated.title,
      article: articleUpdated.article,
      author: educator
    }

    res.status(200).send(articlesMock[articleIndex]);
  } catch (e) {
    res.send(400).send(e);
    return;
  }
})

app.delete('/article/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const articleIndex = articlesMock.findIndex(article => article.id === id);

  if (articleIndex === -1) {
    res.status(400).send(`Article not found with id ${id}`)
    return;
  }

  articlesMock.splice(articleIndex, 1);
  res.sendStatus(204);
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!')
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
});
