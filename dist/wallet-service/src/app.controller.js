"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const prisma_service_1 = require("./prisma.service");
const rxjs_1 = require("rxjs");
const grpc_js_1 = require("@grpc/grpc-js");
let AppController = class AppController {
    prisma;
    client;
    userService;
    constructor(prisma, client) {
        this.prisma = prisma;
        this.client = client;
    }
    onModuleInit() {
        this.userService = this.client.getService('UserService');
    }
    async createWallet(data) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.userService.getUserById({ id: data.userId }));
        }
        catch (error) {
            throw new microservices_1.RpcException({ code: 5, message: 'User not found. Cannot create wallet.' });
        }
        try {
            const wallet = await this.prisma.wallet.create({
                data: {
                    userId: data.userId,
                    balance: 0.0,
                },
            });
            return {
                id: wallet.id,
                userId: wallet.userId,
                balance: wallet.balance,
                createdAt: wallet.createdAt.toISOString(),
            };
        }
        catch (error) {
            throw new microservices_1.RpcException({ code: 6, message: 'Wallet already exists for this user' });
        }
    }
    async getWallet(data) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId: data.userId },
        });
        if (!wallet) {
            throw new microservices_1.RpcException({
                code: grpc_js_1.status.NOT_FOUND,
                message: 'Wallet not found for this user',
            });
        }
        return wallet;
    }
    async debitWallet(data) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId: data.userId },
        });
        if (!wallet) {
            throw new microservices_1.RpcException({ code: grpc_js_1.status.NOT_FOUND, message: 'Wallet not found' });
        }
        if (wallet.balance < data.amount) {
            throw new microservices_1.RpcException({
                code: grpc_js_1.status.FAILED_PRECONDITION,
                message: `Insufficient balance. You are trying to debit ${data.amount}, but you only have ${wallet.balance}.`,
            });
        }
        return this.prisma.wallet.update({
            where: { userId: data.userId },
            data: { balance: { decrement: data.amount } },
        });
    }
};
exports.AppController = AppController;
__decorate([
    (0, microservices_1.GrpcMethod)('WalletService', 'CreateWallet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createWallet", null);
__decorate([
    (0, microservices_1.GrpcMethod)('WalletService', 'GetWallet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getWallet", null);
__decorate([
    (0, microservices_1.GrpcMethod)('WalletService', 'DebitWallet'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "debitWallet", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(1, (0, common_1.Inject)('USER_PACKAGE')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], AppController);
//# sourceMappingURL=app.controller.js.map