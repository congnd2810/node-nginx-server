import { PrismaClient } from "@prisma/client";
// import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
// dotenv.config();

const prisma = new PrismaClient();
let tokenList = {};

const generalAccessToken = (data: any) => {
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "2m",
  });
  return accessToken;
};

const generalRefreshToken = (data: any) => {
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "5m",
  });
  return refreshToken;
};

export const verifyToken = (token: string, secretKey: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
};

export const loginService = ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (user) {
        const checkPassword = await bcrypt.compare(password, user.password);
        console.log(checkPassword);
        if (checkPassword) {
          const access_token = generalAccessToken({
            id: user.id,
            username: user.username,
          });
          const refresh_token = generalRefreshToken({
            id: user.id,
            username: user.username,
          });
          tokenList[refresh_token] = { access_token, refresh_token };
          resolve({
            access_token: access_token,
            refresh_token: refresh_token,
          });
        }
        resolve({
          status: "err",
          message: "Your password is wrong",
        });
      } else {
        resolve({
          status: "err",
          message: "Your username is not existed",
        });
      }
    } catch (error) {
      console.log(error);
      reject({
        status: "err",
        message: error,
      });
    }
  });
};

export const refreshTokenService = (token: string) => {
  return new Promise((resolve, reject) => {
    try {
      if (token && tokenList[token]) {
        jwt.verify(
          token,
          process.env.REFRESH_TOKEN_SECRET,
          async (err, user: any) => {
            if (err) {
              resolve({
                status: 404,
                message: "No token provided.",
              });
            }
            if (user) {
              const newAccessToken = generalAccessToken({
                id: user.id,
                username: user.username,
              });
              resolve({
                access_token: newAccessToken,
              });
            } else {
              resolve({
                status: "err",
                message: "Invalid refresh token.",
              });
            }
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
};
