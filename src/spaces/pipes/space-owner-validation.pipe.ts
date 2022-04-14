import { BadRequestException, Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/user/user.entity';
import { Space } from '../space.entity';
import { SpacesService } from '../spaces.service';

@Injectable({ scope: Scope.REQUEST })
export class SpaceOwnerValidationPipe implements PipeTransform {
    constructor(
        @Inject(REQUEST) private request: Request,
        private spacesService :SpacesService,
    ) {}

    async transform(value: any) {
        const id = value as number;
        const space: Space = await this.spacesService.getSpaceById(id);
        const user: User = JSON.parse(JSON.stringify(this.request.user));
        if (space.ownerId != user.id) {
            throw new BadRequestException(`User (id: ${user.id}) isn't this space's owner. (space id: ${id})`);
        }
        return value;
    }

}