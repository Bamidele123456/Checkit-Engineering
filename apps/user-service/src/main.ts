import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Use Render's assigned port in production, or 50051 locally
  const port = process.env.PORT || 50051; 

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user', 
      protoPath: join(__dirname, '../../packages/proto/user.proto'),
      url: `0.0.0.0:${port}`, // Dynamically binds to the correct port!
    },
  });
  
  await app.listen();
  console.log(`User gRPC Microservice is securely listening on port ${port}`);
}
bootstrap();