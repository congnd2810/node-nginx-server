import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../auth/auth.service";
import { IGetUserAuthInfoRequest } from "..";
import * as jwt from "jsonwebtoken";

// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

export const isAuth = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const tokenFromClient = req.body.token || req.headers["x-access-token"];

  // if token exists
  if (tokenFromClient) {
    try {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      const decoded: any = jwt.verify(tokenFromClient, accessTokenSecret)
      req.user = decoded
      next()
    } catch (error) {
      console.log('Error while verify token', error)
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }
  }
  else {
    // token not found
    return res.status(403).json({
      message: "No token provided"
    })
  }
}