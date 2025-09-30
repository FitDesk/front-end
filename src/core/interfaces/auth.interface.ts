export interface UserLogin {
    roles: string[];
    email: string;
}

export interface AuthRequestLogin {
    email: string
    password: string
}

export interface AuthRequestRegister {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
}

export interface AuthResponse {
    timestamp: Date;
    success: boolean;
    message: string;
}


export interface AuthAccess {
    authorities: Authority[];
    email: string;
    authenticated: boolean;
}

export interface Authority {
    authority: string;
}
