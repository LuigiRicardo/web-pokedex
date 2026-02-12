# Web Pokédex

Uma aplicação interativa de Pokédex construída com **React 18**, **TypeScript** e **Vite**. Explore todas as 9 gerações de Pokémon com busca, filtros por tipo e infinite scrolling otimizado.

## Features

- **Busca por Nome/ID** - Busca instantânea e debounced de Pokémon
- **Filtro por Tipo** - Filtre Pokémon por seus tipos
- **9 Gerações** - Explore todas as gerações de Pokémon (Gen 1-9)
- **Infinite Scrolling** - Carregamento progressivo com IntersectionObserver
- **Modal Detalhado** - Visualize informações completas de cada Pokémon
- **Otimizado para Performance** - Renderização eficiente com React.memo e useMemo
- **Responsive Design** - Interface adaptável para todos os dispositivos com Tailwind CSS

## Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou pnpm

### Setup

```bash
# Clonar repositório
git clone https://github.com/luigiricardo/web-pokedex.git
cd web-pokedex

# Instalar dependências
npm install

# Iniciar dev server
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build otimizado para produção
npm run lint       # Executa ESLint
npm run format     # Formata código com Prettier
npm run preview    # Preview do build
npm run deploy     # Deploy no GitHub Pages
```

## Arquitetura

### Estrutura de Pastas

```bash
src/
 components/          # Componentes React
    common/         # Componentes reutilizáveis (Header, Modal)
    layout/         # Layout estrutural
    pokemon/        # Componentes específicos do domínio
 hooks/              # Custom hooks (usePokemons, useGlobalSearch)
 services/           # Lógica de negócio e integração com API
 api/                # Chamadas HTTP diretas
 mappers/            # Transformação de dados da API
 interfaces/         # Interfaces (mantidas por compatibilidade)
 types/              # Tipos TypeScript centralizados
 constants/          # Constantes da aplicação
 config/             # Configurações globais
 utils/              # Funções utilitárias
 styles/             # Estilos globais (CSS)
```

### Padrões de Arquitetura

**Fluxo de Dados:**

1. **Componentes** consomem dados via hooks customizados
2. **Hooks** orquestram lógica usando services e API
3. **Services** coordenam chamadas à **API** e aplicam **mapeadores**
4. **Mappers** transformam dados brutos em modelos tipados

**State Management:**

- React Hooks (useState, useCallback, useMemo)
- Debouncing para busca (400ms)
- IntersectionObserver para infinite scrolling

## Stack Técnico

- **Frontend:** React 18.3, TypeScript 5.9
- **Build:** Vite 7.2
- **Styling:** Tailwind CSS 4.1
- **Linting:** ESLint 9.39 + TypeScript ESLint
- **Formatting:** Prettier 3.0
- **Routing:** React Router 7.13
- **Virtualização:** React Window 2.2

## Convenções de Código

### Imports

Utilizamos path aliases para imports limpos:

```typescript
//  Recomendado
import { Pokemon } from "@types/pokemon";
import { usePokemons } from "@hooks/usePokemons";
import { Header } from "@components/common/Header";

//  Evitar
import { Pokemon } from "../../../types/pokemon";
```

### Componentes

Todos os componentes devem:

- Ser tipados com `React.FC<Props>`
- Possuir comentários JSDoc descrevendo responsabilidades
- Usar useCallback para callbacks e useMemo para computações custosas

```typescript
interface HeaderProps {
  /** Termo de busca atual */
  searchTerm: string;
  /** Callback ao alterar busca */
  onSearchChange: (value: string) => void;
}

/**
 * Header Component
 *
 * Responsabilidades:
 * - Exibir logo
 * - Prover input de busca
 * - Controlar menu de filtros
 */
export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  // implementação
};
```

### Types

Tipos centralizados em `src/types/`:

- `index.ts` - Tipos genéricos e de UI
- `pokemon.ts` - Tipos específicos do domínio

## API

A aplicação utiliza a [PokéAPI](https://pokeapi.co/api/v2/) como fonte de dados.

**Variáveis de Ambiente:**

```env
VITE_API_BASE_URL=https://pokeapi.co/api/v2
```

Configure em `.env.local` (copie de `.env.example`).

## Linting e Formatting

```bash
# Verificar erros
npm run lint

# Formatar código
npm run format

# Verificar formatação sem alterar
npm run format:check
```

Configurações:

- **ESLint:** `eslint.config.js` (type checking recomendado)
- **Prettier:** `.prettierrc.json` (80 chars, 2 spaces)

## Performance

- Route-based code splitting (preparado para React Router)
- Component-level memoization (React.memo, useMemo, useCallback)
- Infinite scrolling com IntersectionObserver
- Debounced search (400ms)
- Vite build otimizado com tree-shaking

## Licença

MIT - Sinta-se livre para usar este projeto!

## Autor

Desenvolvido por **Luigi Ricardo**

## Links

- [Live Demo](https://luigiricardo.github.io/web-pokedex/)
- [Repositório](https://github.com/luigiricardo/web-pokedex)
- [PokéAPI Docs](https://pokeapi.co/)
