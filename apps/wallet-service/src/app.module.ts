import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { join } from 'path';

@Module({
  imports: [
    // This allows the Wallet app to act as a client sending requests to the User app
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '../../packages/proto/user.proto'),
          url: 'localhost:50051', // The exact port where your User Service is running
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}