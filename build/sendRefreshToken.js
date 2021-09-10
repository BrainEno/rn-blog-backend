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
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = require("./auth");
const User_1 = __importDefault(require("./entities/User"));
const sendRefreshtoken = (res, token) => {
    res.cookie('bot', token, {
        httpOnly: true
    });
};
const sendRefreshTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.bot;
    if (!token) {
        return res.send({ ok: false, accessToken: '' });
    }
    let payload = null;
    try {
        payload = (0, jsonwebtoken_1.verify)(token, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        console.log(err);
        return res.send({ ok: false, accessToken: '' });
    }
    const user = yield User_1.default.findOne({ id: payload.userId });
    if (!user) {
        return res.send({ ok: false, accessToken: '' });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: '' });
    }
    sendRefreshtoken(res, (0, auth_1.createRefreshToken)(user));
    return res.send({ ok: true, accessToken: (0, auth_1.createAccessToken)(user) });
});
const _ = { sendRefreshTokenController, sendRefreshtoken };
exports.default = _;
//# sourceMappingURL=sendRefreshToken.js.map