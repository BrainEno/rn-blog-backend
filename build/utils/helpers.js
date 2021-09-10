"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = exports.makeId = void 0;
function makeId(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.makeId = makeId;
function slugify(str) {
    str = str.trim();
    str = str.toLowerCase();
    const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }
    return str
        .replace(/[^a-zA-z0-9_\u3400-\u9FBF\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
        .replace(/-/g, "-");
}
exports.slugify = slugify;
//# sourceMappingURL=helpers.js.map