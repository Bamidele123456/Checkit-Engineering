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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const prisma_service_1 = require("./prisma.service");
const grpc_js_1 = require("@grpc/grpc-js");
let AppController = class AppController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(data) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                },
            });
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt.toISOString(),
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new microservices_1.RpcException({
                    code: grpc_js_1.status.ALREADY_EXISTS,
                    message: `User with email ${data.email} already exists`
                });
            }
            throw new microservices_1.RpcException({
                code: grpc_js_1.status.INTERNAL,
                message: 'Failed to create user'
            });
        }
    }
    async getUserById(data) {
        const user = await this.prisma.user.findUnique({
            where: { id: data.id },
        });
        if (!user) {
            throw new microservices_1.RpcException({ code: 5, message: 'User not found' });
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt.toISOString(),
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'CreateUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createUser", null);
__decorate([
    (0, microservices_1.GrpcMethod)('UserService', 'GetUserById'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUserById", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map