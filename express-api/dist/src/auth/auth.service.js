"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenService = exports.loginService = exports.verifyToken = void 0;
const client_1 = require("@prisma/client");
// import * as dotenv from "dotenv";
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
// dotenv.config();
const prisma = new client_1.PrismaClient();
let tokenList = {};
const generalAccessToken = (data) => {
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "2m",
    });
    return accessToken;
};
const generalRefreshToken = (data) => {
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "5m",
    });
    return refreshToken;
};
const verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err)
                return reject(err);
            return resolve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;
const loginService = ({ username, password }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield prisma.user.findUnique({
                where: { username },
            });
            if (user) {
                const checkPassword = yield bcrypt.compare(password, user.password);
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
            }
            else {
                resolve({
                    status: "err",
                    message: "Your username is not existed",
                });
            }
        }
        catch (error) {
            console.log(error);
            reject({
                status: "err",
                message: error,
            });
        }
    }));
};
exports.loginService = loginService;
const refreshTokenService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            if (token && tokenList[token]) {
                jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
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
                    }
                    else {
                        resolve({
                            status: "err",
                            message: "Invalid refresh token.",
                        });
                    }
                }));
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.refreshTokenService = refreshTokenService;
