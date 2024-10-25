import express from 'express';
const app = express();
const PORT = 8000;
import cors from 'cors';

app.use(cors({
    origin: "*",
}))

import apiRouter from './routes/api-routes';

app.use("/api", apiRouter)

app.listen(PORT, () => console.log("api server running...", PORT))