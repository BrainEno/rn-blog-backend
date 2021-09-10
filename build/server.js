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
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const createSchema_1 = require("./utils/createSchema");
const graphql_upload_1 = require("graphql-upload");
const http_1 = require("http");
const graphql_1 = require("graphql");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const uploadPicture_1 = require("./uploadPicture");
const sendRefreshToken_1 = __importDefault(require("./sendRefreshToken"));
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    const PORT = process.env.PORT;
    const app = (0, express_1.default)();
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({ origin: '*' }));
    app.use(express_1.default.static('./uploads'));
    app.use((0, graphql_upload_1.graphqlUploadExpress)());
    app.get('/', (_req, res) => res.send('Hello world!'));
    app.post('/upload/avatar', uploadPicture_1.upload.single('file'), uploadPicture_1.uploadAvatar);
    app.post('/upload/blog', uploadPicture_1.upload.single('file'), uploadPicture_1.uploadPicture);
    app.post('/upload/category', uploadPicture_1.upload.single('file'), uploadPicture_1.uploadPicture);
    app.post('/refresh_token', sendRefreshToken_1.default.sendRefreshTokenController);
    const httpServer = (0, http_1.createServer)(app);
    try {
        yield (0, typeorm_1.createConnection)();
        console.log('Database connected!');
    }
    catch (err) {
        console.log(err);
    }
    const schema = yield (0, createSchema_1.createSchema)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
        introspection: true
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app });
    const subscriptionServer = subscriptions_transport_ws_1.SubscriptionServer.create({
        schema,
        execute: graphql_1.execute,
        subscribe: graphql_1.subscribe
    }, {
        server: httpServer,
        path: apolloServer.graphqlPath
    });
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, () => subscriptionServer.close());
    });
    httpServer.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}/graphql`);
    });
});
bootstrap();
//# sourceMappingURL=server.js.map