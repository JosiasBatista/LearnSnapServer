import express from 'express';
import authRouter from './routes/authRoutes';
import contentRouter from './routes/contentRoutes';

const app = express();
const port = 3000;

app.use(express.json());

app.use("/", authRouter);
app.use("/api", contentRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
});
