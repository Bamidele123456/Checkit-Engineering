import { OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
export declare class AppController implements OnModuleInit {
    private readonly prisma;
    private readonly client;
    private userService;
    constructor(prisma: PrismaService, client: ClientGrpc);
    onModuleInit(): void;
    createWallet(data: {
        userId: string;
    }): Promise<{
        id: string;
        userId: string;
        balance: number;
        createdAt: string;
    }>;
    getWallet(data: {
        userId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        balance: number;
        userId: string;
    }>;
    debitWallet(data: {
        userId: string;
        amount: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        balance: number;
        userId: string;
    }>;
}
