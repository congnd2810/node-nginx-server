import * as UserService from "./users.service"
import express, { Request, Response } from "express"
import { isAuth } from "../middleware/auth.middleware";
import { IGetUserAuthInfoRequest } from "..";

export const UsersRouter = express.Router()

// GET Users
// UsersRouter.get("/", async (req: Request, res: Response) => {
//   try {
//     const { country } = req.query
//     const users = await UserService.findAll(country)

//     res.status(200).json(users);
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// });

// POST User/:id

UsersRouter.post("/", async (req: Request, res: Response) => {
  try {
    const user = req.body
    const newUser = await UserService.create(user)
    res.status(201).json(newUser)
  }
  catch (e){
    res.status(500).send(e.message)
  }
})

UsersRouter.use(isAuth)

// GET Users/:id
UsersRouter.get("/", async (req: IGetUserAuthInfoRequest, res: Response) => {
  const id: string = req.user.id

  try{
    const user = await UserService.find(id)
    if (user) return res.status(200).json(user)
    res.status(404).send('User not found')
  }
  catch (e){
    res.status(500).send(e.message)
  }
})


// PUT Users/:id
UsersRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const userUpdate = req.body;

    const existingUser = await UserService.find(id);

    if (existingUser) {
      const updatedUser = await UserService.update(id, userUpdate);
      return res.status(200).json(updatedUser);
    }

    const newUser = await UserService.create(userUpdate);

    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// DELETE Users/:id
UsersRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await UserService.remove(id);

    res.sendStatus(204);
  } catch (e) {
    res.status(500).send(e.message);
  }
});