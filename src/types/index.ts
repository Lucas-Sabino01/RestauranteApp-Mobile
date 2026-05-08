export type Categoria = {
  id: string;
  nome: string;
  icone: string;
};

export type ItemCardapio = {
  nome: string;
  descricao?: string;
  preco: string;
  categoria: string;
  imagem?: string;
};

export type Estabelecimento = {
  id: string;
  nome: string;
  descricao: string;
  endereco: string;
  bairro: string;
  telefone: string;
  horario: string;
  avaliacao: number;
  totalAvaliacoes: number;
  faixaPreco: '$' | '$$' | '$$$' | '$$$$';
  imagem: string;
  fotos: string[];
  categoria: string;
  subcategoria?: string;
  especialidades?: string[];
  cardapio?: ItemCardapio[];
  linkCardapio?: string;
  destaque?: boolean;
  coordenadas: {
    latitude: number;
    longitude: number;
  };
  tags: string[];
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  avatar: string;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type RegisterRequest = {
  nome: string;
  email: string;
  senha: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: Usuario;
};

export type TokenRefreshResponse = {
  token: string;
};

export type Favorito = {
  estabelecimentoId: string;
  adicionadoEm: string;
};

export type ApiError = {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string>;
};

export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type Review = {
  id: string;
  estabelecimentoId: string;
  usuario: {
    nome: string;
    avatar: string;
  };
  nota: number;
  comentario: string;
  data: string;
};

export type Evento = {
  id: string;
  titulo: string;
  descricao: string;
  estabelecimentoId: string;
  estabelecimentoNome: string;
  imagem: string;
  dataInicio: string;
  dataFim: string;
  tipo: 'promoção' | 'evento' | 'especial';
};

export type Reserva = {
  id: string;
  estabelecimentoId: string;
  estabelecimentoNome: string;
  estabelecimentoImagem: string;
  estabelecimentoEndereco: string;
  data: string;
  hora: string;
  pessoas: number;
  obs: string;
  criadoEm: string;
  status: 'confirmada' | 'cancelada';
};
