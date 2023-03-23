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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRouter = void 0;
const UserService = __importStar(require("./users.service"));
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.UsersRouter = express_1.default.Router();
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
exports.UsersRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const newUser = yield UserService.create(user);
        res.status(201).json(newUser);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
exports.UsersRouter.use(auth_middleware_1.isAuth);
// GET Users/:id
exports.UsersRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    try {
        const user = yield UserService.find(id);
        if (user)
            return res.status(200).json(user);
        res.status(404).send('User not found');
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
// PUT Users/:id
exports.UsersRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const userUpdate = req.body;
        const existingUser = yield UserService.find(id);
        if (existingUser) {
            const updatedUser = yield UserService.update(id, userUpdate);
            return res.status(200).json(updatedUser);
        }
        const newUser = yield UserService.create(userUpdate);
        res.status(201).json(newUser);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
// DELETE Users/:id
exports.UsersRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield UserService.remove(id);
        res.sendStatus(204);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
