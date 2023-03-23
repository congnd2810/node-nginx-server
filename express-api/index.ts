// Required External Modules
import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { UsersRouter } from "./src/users/users.router";
import { AuthRouter } from "./src/auth/auth.router";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/middleware/error.middleware";
import { notFoundHandler } from "./src/middleware/not-found.middleware";
import { isAuth } from "./src/middleware/auth.middleware";

dotenv.config();

// Init Prisma 

// App Variables
if (!process.env.PORT) {
  process.exit(1)
}

const PORT = Number(process.env.PORT)||3000

const app: Express = express()

// App Configuration
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(helmet())
app.use(cors())
app.use(express.json())

// Server Activation
const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('server');
});

app.use('/api/auth', AuthRouter)
app.use("/api/users", UsersRouter)


// middleware
app.use(errorHandler)
app.use(notFoundHandler)
app.use(isAuth)
