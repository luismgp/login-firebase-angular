export interface User{

    keyUser: string
    activ: boolean
    name: string
    middleName: string
    email: string
    phone?: string

}

export interface Login {
    email?: string
    password?: string
}