"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 8000;
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)({
    origin: "*",
}));
const api_routes_1 = __importDefault(require("./routes/api-routes"));
app.use("/api", api_routes_1.default);
app.listen(PORT, () => console.log("api server running...", PORT));
