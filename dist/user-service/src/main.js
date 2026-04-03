"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'user',
            protoPath: (0, path_1.join)(__dirname, '../../packages/proto/user.proto'),
            url: '0.0.0.0:50051',
        },
    });
    await app.startAllMicroservices();
    const httpPort = process.env.PORT || 3000;
    await app.listen(httpPort);
    console.log(`User HTTP Service is keeping Render happy on port ${httpPort}`);
    console.log(`User gRPC Microservice is ready for Postman on port 50051`);
}
bootstrap();
//# sourceMappingURL=main.js.map