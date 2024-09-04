import 'passport'

declare module 'passport' {
  interface AuthenticateOptions {
    email?: string
    password?: string
  }
}
