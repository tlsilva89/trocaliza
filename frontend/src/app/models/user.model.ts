export interface User {
  id: number;
  nome: string;
  email: string;
  criadoEm: Date;
}

export interface UserRegister {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha?: string;
}

export interface UserLogin {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}

export interface UpdateProfile {
  nome: string;
  email: string;
}
