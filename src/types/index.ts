export type Categoria = {
  id: string;
  nome: string;
  icone: string;
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  avaliacao: number;
  tempo: string;
  imagem: string;
  categoria: string;
  destaque?: boolean;
  ingredientes?: string[];
};

export type Tamanho = 'P' | 'M' | 'G';

export type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
  tamanho: Tamanho;
};

export type StatusPedido = 'preparando' | 'a_caminho' | 'entregue';

export type ItemPedido = {
  nome: string;
  quantidade: number;
  tamanho?: Tamanho;
  precoUnitario?: number;
};

export type Pedido = {
  id: string;
  data: string;
  itens: ItemPedido[];
  total: number;
  status: StatusPedido;
};

export type CreatePedidoRequest = {
  itens: {
    produtoId: string;
    quantidade: number;
    tamanho: Tamanho;
  }[];
  enderecoId: string;
  metodoPagamento: string;
  observacao?: string;
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

export type Endereco = {
  id: string;
  label: string;
  endereco: string;
  complemento?: string;
  padrao?: boolean;
};

export type Favorito = {
  produtoId: string;
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

export const MULTIPLICADOR_TAMANHO: Record<Tamanho, number> = {
  P: 1.0,
  M: 1.3,
  G: 1.6,
};

export const TAMANHO_LABELS: Record<Tamanho, string> = {
  P: 'Pequeno',
  M: 'Médio',
  G: 'Grande',
};

export const formatarPreco = (valor: number): string => {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
};
