"use strict";
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
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const createSchema_1 = require("./utils/createSchema");
const uploadPicture_1 = require("./uploadPicture");
const sendRefreshToken_1 = __importDefault(require("./sendRefreshToken"));
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const PORT = process.env.PORT;
    const app = express_1.default();
    app.use(morgan_1.default("dev"));
    app.use(cookie_parser_1.default());
    app.use(cors_1.default({ origin: "*" }));
    app.use(express_1.default.static("./uploads"));
    app.get("/", (_req, res) => res.send("Hello world!"));
    app.post("/upload/avatar", uploadPicture_1.upload.single("file"), uploadPicture_1.uploadAvatar);
    app.post("/upload/blog", uploadPicture_1.upload.single("file"), uploadPicture_1.uploadPicture);
    app.post("/upload/category", uploadPicture_1.upload.single("file"), uploadPicture_1.uploadPicture);
    app.post("/refresh_token", sendRefreshToken_1.default.sendRefreshTokenController);
    try {
        yield typeorm_1.createConnection();
        console.log("Database connected!");
    }
    catch (err) {
        console.log(err);
    }
    const schema = yield createSchema_1.createSchema();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
        introspection: true,
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}/graphql`);
    });
});
bootstrap();
//# sourceMappingURL=server.js.map