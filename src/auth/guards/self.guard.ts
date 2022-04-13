import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleType } from 'src/space-roles/role-type.enum';
import { User } from 'src/user/user.entity';
import { SelfDecoratorParams } from '../decorator/self.decorator';

@Injectable()
export class SelfGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as User; //Use passport authentication strategy

        //Priority on method meta
        let selfParams = this.reflector.get<SelfDecoratorParams>('self', context.getHandler());
        if (!selfParams) {
            //Check for class meta
            selfParams = this.reflector.get<SelfDecoratorParams>(
                'selfParams',
                context.getClass(),
            );
        }

        //If still no meta, pass
        if (!selfParams) return true;

        let allowAdmins = selfParams.allowAdmins || true;
        let userIDParam = selfParams.userIDParam;
        if (!user) return false;
        if (request.query[userIDParam] == user.id) return true;
        if (allowAdmins && user.currentRole == RoleType.ADMIN) return true;
    }
}