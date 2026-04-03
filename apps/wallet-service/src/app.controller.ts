import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices'; // <--- THIS IS THE FIX
import { PrismaService } from './prisma.service';
import { firstValueFrom } from 'rxjs';
import { status } from '@grpc/grpc-js'; // Add this if you want standard gRPC status codes


// We define the shape of the gRPC method we are calling from the User Service
interface UserService {
  getUserById(data: { id: string }): any;
}

@Controller()
export class AppController implements OnModuleInit {
  private userService: UserService;

  constructor(
    private readonly prisma: PrismaService,
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  // This lifecycle hook initializes the connection to the User Service
  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @GrpcMethod('WalletService', 'CreateWallet')
  async createWallet(data: { userId: string }) {
    // 1. Inter-Service Communication: Verify User Exists
    try {
      // We convert the gRPC Observable to a Promise using firstValueFrom
      await firstValueFrom(this.userService.getUserById({ id: data.userId }));
    } catch (error) {
      throw new RpcException({ code: 5, message: 'User not found. Cannot create wallet.' });
    }

    // 2. Create the Wallet
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
    } catch (error) {
      throw new RpcException({ code: 6, message: 'Wallet already exists for this user' });
    }
  }



  // --- 1. THE MISSING GET WALLET METHOD ---
  @GrpcMethod('WalletService', 'GetWallet')
  async getWallet(data: { userId: string }) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: data.userId },
    });

    if (!wallet) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Wallet not found for this user',
      });
    }

    return wallet;
  }

  // --- 2. THE STANDARD INSUFFICIENT BALANCE CHECK ---
  @GrpcMethod('WalletService', 'DebitWallet')
  async debitWallet(data: { userId: string; amount: number }) {
    // First, check how much money they actually have
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: data.userId },
    });

    if (!wallet) {
      throw new RpcException({ code: status.NOT_FOUND, message: 'Wallet not found' });
    }

    // The Standard Application Logic: Reject if they are too poor!
    if (wallet.balance < data.amount) {
      throw new RpcException({
        code: status.FAILED_PRECONDITION,
        message: `Insufficient balance. You are trying to debit ${data.amount}, but you only have ${wallet.balance}.`,
      });
    }

    // If they have enough, process the debit
    return this.prisma.wallet.update({
      where: { userId: data.userId },
      data: { balance: { decrement: data.amount } },
    });
  }
}