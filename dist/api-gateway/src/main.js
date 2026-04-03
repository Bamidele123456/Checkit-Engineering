"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const api_gateway_module_1 = require("./api-gateway.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(api_gateway_module_1.ApiGatewayModule);
    await app.listen(process.env.port ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map