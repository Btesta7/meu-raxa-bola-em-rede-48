
# Meu Raxa - Aplicativo de Gestão de Futebol Amateur

## Visão Geral

Meu Raxa é um aplicativo web para gerenciar partidas de futebol amateur, permitindo que jogadores se organizem, confirmem presença, acompanhem estatísticas e interajam através de um sistema de chat.

## Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Login por seleção de perfil de jogador
- Sistema de proteção de rotas
- Diferenciação entre usuários comuns e administradores
- Logout com redirecionamento automático

### 👥 Gestão de Jogadores
- Perfis completos com foto, nome, posição e estatísticas
- Importação de estatísticas via arquivo CSV
- Edição de perfil (nome, idade, biografia, foto)
- Sistema de permissões (admin vs usuário comum)

### ⚽ Gestão de Partidas
- Criação de partidas (apenas administradores)
- Confirmação/cancelamento de presença
- Sorteio automático de times
- Registro de resultados das partidas
- Histórico de partidas com detalhes

### 📊 Estatísticas
- Estatísticas individuais (gols, assistências, cartões, etc.)
- Gráficos de desempenho
- Taxa de presença
- Histórico de participações

### 💬 Sistema de Chat
- Chat em tempo real entre jogadores
- Mensagens com timestamp
- Avatar e nome do usuário

## Estrutura do Projeto

### Tecnologias Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router DOM
- **Estado Global**: React Context API
- **Consultas**: TanStack React Query
- **Icons**: Lucide React
- **Gráficos**: Recharts
- **Processamento PDF**: pdfjs-dist
- **Notificações**: Sonner (toast)

### Arquitetura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui
│   ├── Header.tsx      # Cabeçalho com navegação
│   ├── ProtectedRoute.tsx # Proteção de rotas
│   ├── MatchCard.tsx   # Card de partida
│   ├── PlayerCard.tsx  # Card de jogador
│   └── ...
├── contexts/           # Contextos do React
│   ├── AppContext.tsx  # Context principal (combina todos)
│   ├── UserContext.tsx # Gestão de usuários
│   ├── MatchContext.tsx # Gestão de partidas
│   └── ChatContext.tsx # Gestão de chat
├── pages/              # Páginas da aplicação
│   ├── Login.tsx       # Tela de login
│   ├── Index.tsx       # Dashboard/Partidas
│   ├── Players.tsx     # Lista de jogadores
│   ├── Stats.tsx       # Estatísticas
│   ├── Chat.tsx        # Chat dos jogadores
│   └── ...
├── types/              # Definições TypeScript
│   └── index.ts        # Interfaces principais
├── services/           # Serviços e utilitários
│   └── importService.ts # Importação de dados CSV
└── data/              # Dados mock
    └── mockData.ts    # Dados de exemplo
```

### Principais Interfaces TypeScript

```typescript
// Usuário/Jogador
interface User {
  id: string;
  name: string;
  position: PlayerPosition;
  avatar: string;
  stats: UserStats;
  isAdmin?: boolean;
  age?: number;
  bio?: string;
}

// Estatísticas do jogador
interface UserStats {
  goals: number;
  assists: number;
  matches: number;
  wins: number;
  attendance: number;
  yellowCards: number;
  redCards: number;
}

// Partida
interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
  confirmedPlayers: User[];
  teams?: { teamA: User[]; teamB: User[]; };
  status: "scheduled" | "completed" | "canceled";
  result?: { teamAScore: number; teamBScore: number; };
}
```

## Funcionalidades Implementadas

### ✅ Concluído
- [x] Sistema de login com seleção de perfil
- [x] Proteção de rotas
- [x] Gestão básica de usuários
- [x] Importação de estatísticas via CSV
- [x] Context API para estado global
- [x] Navegação entre páginas
- [x] Header responsivo com logout

### 🚧 Em Desenvolvimento
- [ ] Página de perfil do jogador
- [ ] Edição de perfil completa
- [ ] Gráficos de desempenho individual
- [ ] Sistema completo de criação de partidas (apenas admin)
- [ ] Restrições de edição baseadas em permissões

### 📋 Próximas Funcionalidades
- [ ] Notificações push
- [ ] Histórico detalhado de partidas
- [ ] Sistema de ranking
- [ ] Exportação de relatórios
- [ ] Modo escuro

## Contextos da Aplicação

### AppContext (Principal)
Combina todos os contextos e fornece acesso unificado a:
- Gestão de usuários (login, logout, perfil)
- Gestão de partidas (criar, confirmar presença, resultados)
- Sistema de chat (mensagens)

### UserContext
- Lista de usuários
- Usuário logado atual
- Funções de autenticação
- Atualização de perfis
- Importação de estatísticas

### MatchContext
- Lista de partidas
- Criação e edição de partidas
- Confirmação de presença
- Sorteio de times
- Registro de resultados

### ChatContext
- Mensagens do chat
- Envio de novas mensagens
- Histórico de conversas

## Permissões e Segurança

### Usuário Administrador (Admin)
- Pode criar/editar/cancelar partidas
- Pode editar qualquer perfil de jogador
- Pode importar estatísticas
- Acesso total a todas as funcionalidades

### Usuário Comum (Jogador)
- Pode editar apenas seu próprio perfil
- Pode confirmar/cancelar presença em partidas
- Pode visualizar estatísticas de todos
- Pode participar do chat

## Importação de Dados

### Formato CSV Suportado
O sistema suporta importação via CSV com as seguintes colunas:
```
Nome;Jogos;Vitórias;Gols;Assistências
```

### Processo de Importação
1. Upload do arquivo CSV
2. Parsing automático pulando header
3. Atualização de jogadores existentes
4. Criação de novos jogadores
5. Feedback de sucesso com contadores

## Como Contribuir

### Para Outras IAs

1. **Analise o código existente** antes de fazer alterações
2. **Mantenha a consistência** com os padrões estabelecidos
3. **Use TypeScript** corretamente seguindo as interfaces
4. **Teste as funcionalidades** após implementar
5. **Mantenha os contextos organizados** - não misture responsabilidades
6. **Siga o princípio de responsabilidade única** para componentes

### Padrões de Código

- **Componentes**: Usar functional components com hooks
- **Estado**: Preferir Context API para estado global
- **Styling**: Usar Tailwind CSS + shadcn/ui
- **Tipos**: Sempre tipar corretamente com TypeScript
- **Nomenclatura**: CamelCase para components, kebab-case para arquivos

### Estrutura de Commits
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `refactor:` Refatoração de código
- `style:` Mudanças de estilo/UI
- `docs:` Documentação

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## Estado Atual do Projeto

O projeto está na fase inicial com sistema de autenticação básico implementado. O próximo passo é desenvolver a página de perfil do jogador e expandir as funcionalidades de administração.

### Arquivos Importantes
- `src/types/index.ts` - Todas as interfaces TypeScript
- `src/contexts/AppContext.tsx` - Context principal
- `src/pages/Login.tsx` - Sistema de autenticação
- `src/components/ProtectedRoute.tsx` - Proteção de rotas
- `src/services/importService.ts` - Importação de dados

## Observações para Desenvolvimento

1. **Sempre verificar permissões** antes de permitir ações (admin vs usuário)
2. **Manter responsividade** em todos os componentes
3. **Usar toast notifications** para feedback ao usuário
4. **Validar dados** antes de salvar no contexto
5. **Manter performance** - evitar re-renders desnecessários

Este projeto visa ser uma solução completa para gestão de futebol amateur, com foco na experiência do usuário e facilidade de uso.
