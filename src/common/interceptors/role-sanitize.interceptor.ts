import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { classToPlain, instanceToPlain, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class RoleSanitizeInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const req = context.switchToHttp().getRequest();
    const role = req.user.currentRole;

    return next.handle().pipe(
      map(data => {
        return instanceToPlain(data, { groups: [role] })
      })
    );
  }
}
