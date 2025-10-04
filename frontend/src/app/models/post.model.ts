export interface Post {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  imagemUrl?: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
  usuarioId: number;
  nomeUsuario: string;
  comentarios: Comment[];
}

export interface Comment {
  id: number;
  conteudo: string;
  criadoEm: Date;
  usuarioId: number;
  nomeUsuario: string;
}

export interface CreatePost {
  titulo: string;
  descricao: string;
  categoria: string;
}

export interface UpdatePost {
  titulo: string;
  descricao: string;
  categoria: string;
}

export interface CreateComment {
  conteudo: string;
}
