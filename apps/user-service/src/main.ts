import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Create a standard HTTP app (This makes Render happy)
  const app = await NestFactory.create(AppModule);

  // 2. Connect your gRPC microservice alongside it
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user', 
      protoPath: join(__dirname, '../../packages/proto/user.proto'),
      url: '0.0.0.0:50051', // Postman will use this
    },
  });

  // 3. Start the gRPC microservice
  await app.startAllMicroservices();

  // 4. Start the HTTP server on the port Render provides
  const httpPort = process.env.PORT || 3000;
  await app.listen(httpPort);
  
  console.log(`User HTTP Service is keeping Render happy on port ${httpPort}`);
  console.log(`User gRPC Microservice is ready for Postman on port 50051`);
}
bootstrap();