import { PrismaService } from './prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(data: {
        email: string;
        name: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: string;
    }>;
    getUserById(data: {
        id: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: string;
    }>;
}
