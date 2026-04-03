import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { status } from '@grpc/grpc-js';
import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  // The 'UserService' string must match the service name in user.proto
  // The 'CreateUser' string must match the rpc method in user.proto

  @Get('/')
  healthCheck() {
    return {
      status: 'Online',
      architecture: 'gRPC Microservices',
      message: 'User Service is live. Please use local Postman to test gRPC endpoints. See README for details.',
    };
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: { email: string; name: string }) {
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
    } catch (error) {
      if (error.code === 'P2002') {
        throw new RpcException({ 
          code: status.ALREADY_EXISTS, 
          message: `User with email ${data.email} already exists` 
        });
      }
      throw new RpcException({ 
        code: status.INTERNAL, 
        message: 'Failed to create user' 
      });
    }
  }

  @GrpcMethod('UserService', 'GetUserById')
  async getUserById(data: { id: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      // code 5 is the standard gRPC status code for NOT_FOUND
      throw new RpcException({ code: 5, message: 'User not found' });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
}