'use strict'

import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connection } from './db/dbConnection'
import { userRouter, postRouter } from './routes';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT! || 3000;

const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yml"), "utf8");
const swaggerDocument = YAML.parse(file);

app.use(cors());

app.use(bodyParser.json());
app.use("/api", userRouter);
app.use("/api", postRouter);

app.use('/social-media-apis/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument), () => {});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Home page." });
});

async function startServer(): Promise<void> {
    try {
        await connection;
        server.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
}

startServer();
