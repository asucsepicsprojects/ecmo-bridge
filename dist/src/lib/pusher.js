"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pusher = void 0;
exports.runMatchingAlgorithm = runMatchingAlgorithm;
const pusher_1 = __importDefault(require("pusher"));
exports.pusher = new pusher_1.default({
    appId: process.env.PUSHER_APP_ID || "",
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "",
    secret: process.env.PUSHER_APP_SECRET || "",
    cluster: process.env.PUSHER_APP_CLUSTER || "",
    useTLS: true,
});
async function runMatchingAlgorithm() {
    // Trigger an event after or before running the algorithm
    exports.pusher.trigger("matching-channel", "run-matching", {
        message: "Triggering the matching algorithm",
    });
}
