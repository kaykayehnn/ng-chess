export class User {
  constructor (
    public email: string = '',
    public password: string = '',
    public avatarUrl: string,
    public roles: string
  ) { }
}
