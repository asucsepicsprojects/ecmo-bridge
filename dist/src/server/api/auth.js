"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = checkAuth;
const server_1 = require("@clerk/nextjs/server");
function checkAuth() {
    const { userId } = (0, server_1.auth)();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    return userId;
}
