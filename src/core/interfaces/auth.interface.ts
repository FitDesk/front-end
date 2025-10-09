export interface UserLogin {
    id: string;
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
    id: string;
    authorities: Authority[];
    email: string;
    authenticated: boolean;
}

export interface Authority {
    authority: string;
}
