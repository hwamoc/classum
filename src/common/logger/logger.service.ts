import { ConsoleLogger, Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as config from 'config';

@Injectable()
export class AppLogger extends ConsoleLogger implements LoggerService {
    constructor(
        context: string,
        options?: {
            timestamp?: boolean;
        },
    ) {
        super(context, options);
        /***
         * @condition to check if it is in testing mode
         */
        const levels: LogLevel[] = config.get('app.logging') ? ['log'] : [];
        this.setLogLevels(levels);
    }
}