export class Email {
    email: string;
    constructor(email: string) {
        this.email = email;
    }
}

export class Id {
    id: number;
    constructor(id: number) {
        this.id = id;
    }
}

export class Firstname {
    firstname: string;
    constructor(firstname: string) {
        this.firstname = firstname;
    }
}

export class Lastname {
    lastname: string;
    constructor(lastname: string) {
        this.lastname = lastname;
    }
}

export class username {
    firstname: string;
    lastname: string;
    fullname: string;
    constructor(firstname: string, lastname: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.fullname = `${firstname} ${lastname}`;
    }
}
