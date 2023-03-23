import * as AuthService from "./auth.service";
import express, { Request, Response } from "express";

export const AuthRouter = express.Router();

// Login User
AuthRouter.post("/login", async (req: Request, res: Response) => {
  console.log(req.body)
  const data = await AuthService.loginService(req.body)
  console.log(data)
  res.status(201).json({data})
});
// POST User/:id