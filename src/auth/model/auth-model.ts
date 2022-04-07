export class AuthCookie {
    accessToken: string;
    domain: string = 'localhost';
    path: string =  '/';
    httpOnly: boolean = true;
    maxAge: number;
    constructor(param: any) {
        this.accessToken = param.accessToken;
        this.maxAge = param.maxAge;
    }
}

export class RefreshCookie {
    refreshToken: string;
    domain: string = 'localhost';
    path: string =  '/';
    httpOnly: boolean = true;
    maxAge: number;
    constructor(param: any) {
        this.refreshToken = param.refreshToken;
        this.maxAge = param.maxAge;
    }
}
export class CookieClearOption {
    domain: string =  'localhost';
    path: string = '/';
    httpOnly: boolean = true;
    maxAge: number = 0;
}