import { SetMetadata } from '@nestjs/common';

export interface SelfDecoratorParams {
    userIDParam: string;
    allowAdmins?: boolean;
}
export const Self = (params: SelfDecoratorParams) => SetMetadata('self', params);
