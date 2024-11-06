import express from 'express';
import cors from 'cors';

import authRouter from './routes/authRoutes';
import contentRouter from './routes/contentRoutes';
import userRouter from './routes/userRoutes';
import areaRouter from './routes/areaRoutes';
import contentScheduler from './schedule/index';

const app = express();
const port = 3000;
const corsOptions = {
  origin: 'https://learnsnap.vercel.app/',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
})
app.use(express.json());

app.use("/", authRouter);
app.use("/api", contentRouter);
app.use("/api", areaRouter);
app.use("/api", userRouter);

contentScheduler;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
});
