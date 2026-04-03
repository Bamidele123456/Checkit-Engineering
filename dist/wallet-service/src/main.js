"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'wallet',
            protoPath: (0, path_1.join)(__dirname, '../../packages/proto/wallet.proto'),
            url: '0.0.0.0:50052',
        },
    });
    await app.listen();
    console.log('Wallet Microservice is listening on port 50052');
}
bootstrap();
//# sourceMappingURL=main.js.map