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
exports.uploadPicture = exports.uploadAvatar = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./utils/helpers");
const User_1 = __importDefault(require("./entities/User"));
const fs_1 = __importDefault(require("fs"));
const Blog_1 = __importDefault(require("./entities/Blog"));
const Category_1 = __importDefault(require("./entities/Category"));
const imageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: 'uploads/images',
        filename: (_, file, callback) => {
            const name = (0, helpers_1.makeId)(15);
            callback(null, name + path_1.default.extname(file.originalname));
        }
    }),
    fileFilter: (_, file, callback) => {
        if (imageTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error('无效的图片类型'));
        }
    }
});
const uploadAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOneOrFail({ username: req.body.username });
    if (!user)
        throw new Error('验证失败');
    try {
        const type = req.body.type;
        if (type !== 'avatar') {
            fs_1.default.unlinkSync(req.file.path);
            return res.status(400).json({ error: '无效的类型' });
        }
        let oldAvatarUrn = '';
        if (type === 'avatar') {
            oldAvatarUrn = user.avatar || '';
            user.avatar = req.file.filename;
        }
        yield user.save();
        if (oldAvatarUrn !== '') {
            fs_1.default.unlinkSync(`uploads\\images\\${oldAvatarUrn}`);
        }
        return res.json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: '有什么地方出错了' });
    }
});
exports.uploadAvatar = uploadAvatar;
const uploadPicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOneOrFail({ username: req.body.username });
    if (!user)
        throw new Error('验证失败');
    try {
        const type = req.body.type;
        if (type !== 'image' && type !== 'banner') {
            fs_1.default.unlinkSync(req.file.path);
            return res.status(400).json({ error: '无效的类型' });
        }
        let oldImageUrn = '';
        if (type === 'image') {
            const blog = yield Blog_1.default.findOneOrFail({
                identifier: req.body.identifier
            });
            if (!blog)
                throw new Error('无法上传文章配图');
            oldImageUrn = blog.imageUrn || '';
            blog.imageUrn = req.file.filename;
            yield blog.save();
            if (oldImageUrn !== '') {
                fs_1.default.unlinkSync(`uploads\\images\\${oldImageUrn}`);
            }
            return res.json(blog);
        }
        else if (type === 'banner') {
            const cat = yield Category_1.default.findOneOrFail({ name: req.body.catName });
            if (!cat)
                throw new Error('无法上传封面图');
            oldImageUrn = cat.bannerUrn || '';
            cat.bannerUrn = req.file.filename;
            yield cat.save();
            if (oldImageUrn !== '') {
                fs_1.default.unlinkSync(`uploads\\images\\${oldImageUrn}`);
            }
            return res.json(cat);
        }
        return true;
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: '有什么地方出错了' });
    }
});
exports.uploadPicture = uploadPicture;
//# sourceMappingURL=uploadPicture.js.map