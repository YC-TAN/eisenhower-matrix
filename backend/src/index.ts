import express from "express";
import {env} from './config/env';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
    console.log("Someone pinged !");
    res.send('Hello');
});

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});