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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Required External Modules
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const users_router_1 = require("./src/users/users.router");
const auth_router_1 = require("./src/auth/auth.router");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = require("./src/middleware/error.middleware");
const not_found_middleware_1 = require("./src/middleware/not-found.middleware");
const auth_middleware_1 = require("./src/middleware/auth.middleware");
dotenv.config();
// Init Prisma 
// App Variables
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = Number(process.env.PORT) || 3000;
const app = (0, express_1.default)();
// App Configuration
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Server Activation
const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('server');
});
app.use('/api/auth', auth_router_1.AuthRouter);
app.use("/api/users", users_router_1.UsersRouter);
// middleware
app.use(error_middleware_1.errorHandler);
app.use(not_found_middleware_1.notFoundHandler);
app.use(auth_middleware_1.isAuth);
