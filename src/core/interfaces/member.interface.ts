export interface MemberResponse {
    userId: string,
    firstName: string,
    lastName: string,
    dni: string,
    phone: string,
    profileImageUrl: string,
    status: string
}

export interface MemberRequest{
    firstName?: string,
    lastName?: string,
    dni?: string,
    phone?: string,
    profileImageUrl?: string,
}
