

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

export type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
  tamanho: 'P' | 'M' | 'G';
};

export type Pedido = {
  id: string;
  data: string;
  itens: { nome: string; quantidade: number }[];
  total: number;
  status: 'preparando' | 'a_caminho' | 'entregue';
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  avatar: string;
};

export const CATEGORIAS: Categoria[] = [
  { id: '0', nome: 'Tudo', icone: '☕' },
  { id: '1', nome: 'Cafés', icone: '🫖' },
  { id: '2', nome: 'Gelados', icone: '🧊' },
  { id: '3', nome: 'Doces', icone: '🍰' },
  { id: '4', nome: 'Salgados', icone: '🥐' },
  { id: '5', nome: 'Bebidas', icone: '🥤' },
];

export const PRODUTOS: Produto[] = [

  {
    id: '1',
    nome: 'Cappuccino Clássico',
    descricao: 'Café expresso aveludado com leite vaporizado, finalizado com uma camada cremosa de espuma e canela em pó.',
    preco: 15.90,
    avaliacao: 4.8,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80',
    categoria: 'Cafés',
    destaque: true,
    ingredientes: ['Café expresso', 'Leite integral', 'Espuma de leite', 'Canela'],
  },
  {
    id: '2',
    nome: 'Mocha Especial',
    descricao: 'Harmonia perfeita de café expresso, chocolate belga e leite cremoso, coroado com chantilly artesanal.',
    preco: 18.50,
    avaliacao: 4.9,
    tempo: '7 min',
    imagem: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=400&q=80',
    categoria: 'Cafés',
    destaque: true,
    ingredientes: ['Café expresso', 'Chocolate belga', 'Leite', 'Chantilly'],
  },
  {
    id: '3',
    nome: 'Espresso Duplo',
    descricao: 'Duas doses de café expresso extraídas com grãos selecionados, intenso e encorpado.',
    preco: 10.00,
    avaliacao: 4.7,
    tempo: '3 min',
    imagem: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=400&q=80',
    categoria: 'Cafés',
    destaque: true,
    ingredientes: ['Café expresso (dose dupla)'],
  },
  {
    id: '4',
    nome: 'Latte Macchiato',
    descricao: 'Leite vaporizado suavemente manchado com shot de espresso, delicado e cremoso.',
    preco: 14.90,
    avaliacao: 4.6,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=400&q=80',
    categoria: 'Cafés',
    ingredientes: ['Café expresso', 'Leite vaporizado'],
  },

  {
    id: '5',
    nome: 'Iced Latte Caramelo',
    descricao: 'Café gelado com leite cremoso e calda de caramelo artesanal, servido com gelo.',
    preco: 18.00,
    avaliacao: 4.8,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80',
    categoria: 'Gelados',
    destaque: true,
    ingredientes: ['Café expresso', 'Leite', 'Calda de caramelo', 'Gelo'],
  },
  {
    id: '6',
    nome: 'Frappuccino Chocolate',
    descricao: 'Bebida gelada batida com café, chocolate, leite e gelo, finalizada com chantilly.',
    preco: 22.00,
    avaliacao: 4.7,
    tempo: '7 min',
    imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
    categoria: 'Gelados',
    ingredientes: ['Café', 'Chocolate', 'Leite', 'Gelo', 'Chantilly'],
  },
  {
    id: '7',
    nome: 'Cold Brew',
    descricao: 'Café extraído a frio por 12 horas, suave e com baixa acidez. Puro ou com leite.',
    preco: 16.00,
    avaliacao: 4.9,
    tempo: '3 min',
    imagem: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80',
    categoria: 'Gelados',
    ingredientes: ['Café cold brew', 'Gelo'],
  },

  {
    id: '8',
    nome: 'Bolo de Chocolate',
    descricao: 'Fatia generosa de bolo fofinho com ganache de chocolate belga e raspas crocantes.',
    preco: 16.90,
    avaliacao: 4.9,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    categoria: 'Doces',
    ingredientes: ['Chocolate belga', 'Farinha', 'Ovos', 'Manteiga', 'Ganache'],
  },
  {
    id: '9',
    nome: 'Cheesecake Frutas Vermelhas',
    descricao: 'Cheesecake cremoso com base crocante de biscoito, coberto com calda de frutas vermelhas frescas.',
    preco: 19.90,
    avaliacao: 4.8,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80',
    categoria: 'Doces',
    ingredientes: ['Cream cheese', 'Biscoito', 'Frutas vermelhas', 'Açúcar'],
  },
  {
    id: '10',
    nome: 'Brownie com Nozes',
    descricao: 'Brownie intenso de chocolate meio amargo com nozes crocantes e sorvete de baunilha.',
    preco: 14.50,
    avaliacao: 4.7,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80',
    categoria: 'Doces',
    ingredientes: ['Chocolate meio amargo', 'Nozes', 'Manteiga', 'Ovos'],
  },

  {
    id: '11',
    nome: 'Croissant Francês',
    descricao: 'Croissant folhado e amanteigado assado na hora, crocante por fora e macio por dentro.',
    preco: 12.50,
    avaliacao: 4.6,
    tempo: '10 min',
    imagem: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
    categoria: 'Salgados',
    ingredientes: ['Farinha', 'Manteiga francesa', 'Fermento', 'Sal'],
  },
  {
    id: '12',
    nome: 'Pão de Queijo Mineiro',
    descricao: 'Pão de queijo artesanal feito com polvilho e queijo canastra da Serra da Canastra.',
    preco: 8.90,
    avaliacao: 4.7,
    tempo: '8 min',
    imagem: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=400&q=80',
    categoria: 'Salgados',
    ingredientes: ['Polvilho azedo', 'Queijo canastra', 'Ovos', 'Óleo'],
  },
  {
    id: '13',
    nome: 'Sanduíche Club',
    descricao: 'Pão artesanal com peito de peru defumado, queijo gruyère, tomate e rúcula fresca.',
    preco: 24.90,
    avaliacao: 4.5,
    tempo: '12 min',
    imagem: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80',
    categoria: 'Salgados',
    ingredientes: ['Pão artesanal', 'Peru defumado', 'Queijo gruyère', 'Rúcula', 'Tomate'],
  },

  {
    id: '14',
    nome: 'Suco Natural Laranja',
    descricao: 'Suco de laranja fresco espremido na hora, sem adição de açúcar ou conservantes.',
    preco: 12.00,
    avaliacao: 4.6,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=400&q=80',
    categoria: 'Bebidas',
    ingredientes: ['Laranja pera'],
  },
  {
    id: '15',
    nome: 'Chá Verde com Limão',
    descricao: 'Chá verde orgânico com rodelas de limão siciliano e mel, servido quente ou gelado.',
    preco: 10.90,
    avaliacao: 4.5,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
    categoria: 'Bebidas',
    ingredientes: ['Chá verde', 'Limão siciliano', 'Mel'],
  },
  {
    id: '16',
    nome: 'Smoothie de Morango',
    descricao: 'Smoothie refrescante de morango fresco batido com iogurte grego e mel orgânico.',
    preco: 16.50,
    avaliacao: 4.8,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80',
    categoria: 'Bebidas',
    ingredientes: ['Morango', 'Iogurte grego', 'Mel', 'Gelo'],
  },
];

export const MULTIPLICADOR_TAMANHO = {
  P: 1.0,
  M: 1.3,
  G: 1.6,
};

export const TAMANHO_LABELS = {
  P: 'Pequeno',
  M: 'Médio',
  G: 'Grande',
};

export const PEDIDOS_MOCK: Pedido[] = [
  {
    id: 'PED001',
    data: '19/04/2026',
    itens: [
      { nome: 'Cappuccino Clássico', quantidade: 2 },
      { nome: 'Croissant Francês', quantidade: 1 },
    ],
    total: 44.30,
    status: 'entregue',
  },
  {
    id: 'PED002',
    data: '18/04/2026',
    itens: [
      { nome: 'Mocha Especial', quantidade: 1 },
      { nome: 'Bolo de Chocolate', quantidade: 1 },
    ],
    total: 35.40,
    status: 'entregue',
  },
  {
    id: 'PED003',
    data: '20/04/2026',
    itens: [
      { nome: 'Iced Latte Caramelo', quantidade: 1 },
      { nome: 'Brownie com Nozes', quantidade: 2 },
    ],
    total: 47.00,
    status: 'preparando',
  },
];

export const formatarPreco = (valor: number): string => {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
};

export const getDestaques = (): Produto[] => {
  return PRODUTOS.filter(p => p.destaque);
};

export const getProdutosPorCategoria = (categoria: string): Produto[] => {
  if (categoria === 'Tudo') return PRODUTOS;
  return PRODUTOS.filter(p => p.categoria === categoria);
};

export const buscarProdutos = (termo: string): Produto[] => {
  const termoLower = termo.toLowerCase();
  return PRODUTOS.filter(
    p =>
      p.nome.toLowerCase().includes(termoLower) ||
      p.descricao.toLowerCase().includes(termoLower) ||
      p.categoria.toLowerCase().includes(termoLower)
  );
};
