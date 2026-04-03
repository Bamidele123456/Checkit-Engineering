import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController], // <-- Make sure this is here!
  providers: [PrismaService],
})
export class AppModule {}