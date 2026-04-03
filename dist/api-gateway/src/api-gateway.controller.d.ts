import { ApiGatewayService } from './api-gateway.service';
export declare class ApiGatewayController {
    private readonly apiGatewayService;
    constructor(apiGatewayService: ApiGatewayService);
    getHello(): string;
}
