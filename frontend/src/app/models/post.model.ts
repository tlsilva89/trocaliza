import { Comentario } from './comentario.model';

export interface Post {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  criadoEm: string;
  atualizadoEm: string;
  usuarioId: number;
  nomeUsuario: string;
  comentarios: Comentario[];
}