import { UserServiceService } from './user-service.service';
export declare class UserServiceController {
    private readonly userServiceService;
    constructor(userServiceService: UserServiceService);
    getHello(): string;
}
