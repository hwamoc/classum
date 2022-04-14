import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
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
        if (config.get('app.logging')) {
            this.setLogLevels(['debug', 'error', 'log',]);
        }
    }
}