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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TransactionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // 引用 User 模型
        required: true,
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order", // 引用 Order 模型
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0, // 确保金额为非负数
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"], // 限制状态范围
        required: true,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed, // 允许存储任意键值对
        default: {}, // 默认值为空对象
    },
}, {
    timestamps: true, // 自动生成 createdAt 和 updatedAt
});
exports.TransactionModel = mongoose_1.default.model("Transaction", TransactionSchema);
