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
exports.remove = exports.update = exports.create = exports.find = exports.findAll = void 0;
const client_1 = require("@prisma/client");
const falso_1 = require("@ngneat/falso");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const findAll = (country) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (country) {
            const users = yield prisma.user.findMany({
                where: { country },
            });
            return users;
        }
        const users = yield prisma.user.findMany();
        return users;
    }
    catch (e) {
        console.log(e);
        return 'fail to get users';
    }
});
exports.findAll = findAll;
const find = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: { id },
        });
        return user;
    }
    catch (e) {
        console.log(e);
        return 'fail to get user';
    }
});
exports.find = find;
const create = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    newUser.id = (0, falso_1.randUuid)();
    newUser.token = '';
    const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(newUser.email);
    if (isEmail) {
        const hashPassword = bcrypt.hashSync(newUser.password, 10);
        newUser.password = hashPassword;
    }
    console.log(newUser);
    try {
        yield prisma.user.create({
            data: newUser,
        });
        return 'success to create';
    }
    catch (e) {
        console.log(e);
        return 'fail to create';
    }
});
exports.create = create;
const update = (id, userUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.user.update({
            where: { id: id },
            data: userUpdate,
        });
        return 'update successful';
    }
    catch (e) {
        console.log(e);
        return 'failed to update';
    }
});
exports.update = update;
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.user.delete({
            where: { id: id },
        });
        return 'delete successful';
    }
    catch (e) {
        console.log(e);
        return 'failed to delete';
    }
});
exports.remove = remove;
