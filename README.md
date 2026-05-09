# 🍽️ Guia Curitiba - Premium Mobile Experience

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Navigation-5C2D91?style=for-the-badge&logo=react&logoColor=white" alt="React Navigation" />
</p>

O **Guia Curitiba** é um aplicativo mobile premium, desenvolvido para ser um guia gastronômico completo da cidade. Construído com **React Native** e **Expo**, o app se destaca por sua interface do usuário incrivelmente polida, UX imersiva e animações fluidas, servindo como uma prova de conceito de alta qualidade para produtos de mercado.

## ✨ Destaques de UX/UI

Este aplicativo não é apenas funcional; ele é projetado para **"wow"** o usuário final. 

- **🎨 Design System Consistente:** Paleta de cores premium (Dark/Light mode automático), tipografia moderna (`Poppins`) e uso extensivo de `glassmorphism`.
- **🎬 Micro-Interações e Animações:** Transições de tela suaves, modais com `Animated.spring`, scale effects em botões e skeleton loaders dinâmicos.
- **🚀 Onboarding Imersivo:** Fluxo de boas-vindas com 4 passos, uso de emojis grandes, backgrounds com gradiente e indicadores parallax.
- **🏝️ Empty States Visuais:** Telas de "Sem Resultados" e "Favoritos Vazios" não são apenas textos; contam com ilustrações criadas via composição de ícones e bolhas animadas.

## 🚀 Principais Funcionalidades

1. **Home Personalizada & Descoberta:**
   - Detecção de localização (`expo-location`) para sugerir locais "Perto de Você".
   - Sistema de recomendação "Sugestões para Você" baseado nas categorias mais favoritadas pelo usuário.
   - Destaque da semana e eventos gastronômicos acontecendo.

2. **Detalhes Ricos e Completos:**
   - Páginas de estabelecimentos com galerias de fotos de alta resolução.
   - Cardápios expandidos e categorizados (até 10 itens por local).
   - Sistema de visualização de status de funcionamento ("Aberto Agora" / "Fechado").

3. **Sistema de Reserva de Mesas (Mock):**
   - Modal completo para seleção de data (14 dias), horário, número de pessoas e observações.
   - Tela de confirmação com animações de sucesso (`checkmark-circle`).

4. **Busca Avançada & Filtros:**
   - Busca instantânea otimizada com Hook de Debounce.
   - Histórico de buscas recentes salvo localmente (`AsyncStorage`).
   - Modal de filtros complexos (distância, faixa de preço, tags e subcategorias).

5. **Navegação em Mapa:**
   - Integração com `react-native-maps`.
   - Marcadores customizados com emojis para categorias.
   - Integração para rota rápida ("Como Chegar") abrindo Google Maps/Apple Maps.

## 🛠️ Tecnologias Utilizadas

- **Framework:** React Native + Expo (SDK 50+)
- **Linguagem:** TypeScript (Tipagem estrita habilitada)
- **Roteamento:** React Navigation v7 (Bottom Tabs, Native Stack)
- **Gerenciamento de Estado:** Context API + Custom Hooks (`useMemo`, `useCallback`)
- **Estilização:** StyleSheet API, SafeAreaContext
- **Armazenamento:** AsyncStorage (Local Storage)
- **Mapas:** react-native-maps
- **Permissões & Sensores:** expo-location, expo-haptics

## 📂 Estrutura do Projeto

```text
src/
├── components/       # Componentes visuais reutilizáveis (Botões, Cards, Modais)
│   └── ui/           # Subcomponentes menores (Badges, Skeletons, ErrorStates)
├── contexts/         # Context API (Theme, Auth, Favorites, Location, Reviews)
├── data/             # Dados mockados robustos (mock.ts)
├── hooks/            # Hooks customizados para lógica de negócios (useDebounce, etc)
├── navigation/       # Configuração do React Navigation e Tipagens (types.ts)
├── screens/          # Telas principais (Home, Search, Map, Favorites, Detail)
├── theme/            # Design System (Cores, Fontes, Espaçamentos globais)
└── utils/            # Funções utilitárias (formatações, cálculo de distância)
```

## 📱 Como Rodar Localmente

### Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:
- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) (recomendado versão 18+)
- Um dispositivo físico iOS ou Android com o app **Expo Go** instalado.

### Passo a Passo

1. **Clone o repositório e instale as dependências:**
   ```bash
   npm install
   ```
2. **Inicie o servidor do Expo:**
   ```bash
   npx expo start -c
   ```
3. **Execute no seu aparelho:**
   - Baixe o app **Expo Go** no iOS ou Android.
   - Escaneie o QR Code que aparece no terminal.

*Nota:* Como o app usa integrações nativas de mapa, ele rodará melhor no ambiente mobile físico (Expo Go) do que no emulador web.

## 👨‍💻 Autor

Feito com 💜 por **Lucas Sabino**.  
Entre em contato ou veja mais projetos:

- [![Portfolio](https://img.shields.io/badge/Portfolio-0077B5?style=for-the-badge&logo=Portfolio&logoColor=white)](https://lucassabino-portfolio.vercel.app/)
- [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lucas-Sabino01/)

## 📄 Licença

Este projeto está sob a licença MIT.

---
> *Desenvolvido com foco obsessivo em qualidade e experiência do usuário.*
