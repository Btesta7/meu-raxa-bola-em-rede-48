
# ⚽ Meu Raxa - Plataforma Completa para Gestão de Futebol Amateur

## 📋 Visão Geral do Projeto

**Meu Raxa** é uma aplicação web SPA (Single Page Application) desenvolvida em React + TypeScript para gerenciar partidas de futebol amateur. O sistema permite que jogadores se organizem, confirmem presença, acompanhem estatísticas e participem de partidas ao vivo com funcionalidades avançadas como sorteio de times, cronômetro, placar em tempo real e histórico de eventos.

## 🎯 Funcionalidades Principais

### 🔐 Sistema de Autenticação Completo
- **Login/Registro**: Formulários com validação rigorosa usando Zod
- **Recuperação de Senha**: Sistema de reset via email
- **Sessão Persistente**: Suporte a "Lembrar-me" com localStorage/sessionStorage
- **Rotas Protegidas**: Middleware de autenticação automático

### 👤 Gestão de Perfil Avançada
- **Onboarding Guiado**: Processo em 4 etapas para novos usuários
  - Informações básicas (nome, idade, telefone)
  - Dados de futebol (posição, pé preferido, experiência)
  - Upload de avatar e biografia
  - Contato de emergência
- **Perfil Completo**: Informações pessoais, estatísticas, preferências
- **Avatar Dinâmico**: Upload com preview e geração automática
- **Validação em Tempo Real**: Feedback instantâneo nos formulários

### ⚽ Sistema de Partidas ao Vivo (Live Match)
- **Sorteio Automático de Times**: Algoritmo balanceado por skill level
- **Seleção de Partidas**: Interface para escolher times que vão jogar
- **Partida ao Vivo**: Sistema completo com:
  - Cronômetro personalizável (7 minutos padrão)
  - Placar em tempo real
  - Registro de gols e assistências
  - Histórico de eventos com opção de desfazer
  - Declaração automática de vencedor (primeiro a 2 gols)
- **Múltiplas Partidas**: Sistema de rotação com times de espera
- **Scoreboard Realístico**: Visual inspirado em transmissões esportivas

### 📊 Sistema de Estatísticas
- **Stats Individuais**: Gols, assistências, partidas, vitórias, cartões
- **Import/Export**: Importação de dados via CSV
- **Gráficos Interativos**: Visualizações usando Recharts
- **Histórico Completo**: Rastreamento de performance ao longo do tempo

### 🔔 Sistema de Notificações
- **Notificações em Tempo Real**: Lembretes de partidas, atualizações
- **Central de Notificações**: Interface dedicada para gerenciar alertas
- **Configurações Personalizáveis**: Controle fino sobre tipos de notificação

### ⚙️ Sistema de Preferências
- **Temas**: Claro, escuro e automático
- **Layout Personalizável**: Dashboard com widgets configuráveis
- **Privacidade**: Controles de visibilidade do perfil
- **Persistência**: Configurações salvas localmente

## 🏗️ Arquitetura Técnica

### Stack Tecnológica
```
Frontend Framework: React 18 + TypeScript + Vite
UI Framework: Tailwind CSS + shadcn/ui
Routing: React Router DOM v6
State Management: Context API + TanStack React Query
Forms: React Hook Form + Zod validation
Animations: Framer Motion
Icons: Lucide React
Charts: Recharts
```

### Estrutura de Pastas
```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base shadcn/ui
│   ├── auth/            # Sistema de autenticação
│   ├── onboarding/      # Fluxo de onboarding
│   ├── profile/         # Gestão de perfil
│   ├── live-match/      # Sistema de partidas ao vivo
│   ├── dashboard/       # Widgets do dashboard
│   └── notifications/   # Sistema de notificações
├── contexts/            # Contextos React (estado global)
├── pages/               # Páginas da aplicação
├── types/               # Definições TypeScript
├── hooks/               # Custom hooks
├── utils/               # Funções utilitárias
├── data/                # Dados mock para desenvolvimento
└── services/            # Serviços e APIs
```

### Gerenciamento de Estado
- **Context API**: Estado global da aplicação
- **UserContext**: Autenticação e dados do usuário
- **MatchContext**: Gestão de partidas
- **PreferencesContext**: Configurações do usuário
- **NotificationContext**: Sistema de notificações
- **AuditContext**: Auditoria de ações

## 📱 Interfaces Principais

### Tipos de Usuário
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  position: PlayerPosition; // "Goleiro" | "Defensor" | "Meio-campista" | "Atacante"
  avatar: string;
  stats: UserStats;
  isAdmin?: boolean;
  age?: number;
  bio?: string;
  phone?: string;
  secondaryPositions?: PlayerPosition[];
  preferredFoot?: 'right' | 'left' | 'both';
  yearsPlaying?: number;
  emergencyContact?: EmergencyContact;
  preferences?: UserPreferences;
  isProfileComplete?: boolean;
  onboardingStep?: number;
}
```

### Sistema de Partidas
```typescript
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

### Live Match System
```typescript
interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  logo: string;
  gradient: string;
  players: Player[];
}

interface MatchEvent {
  id: string;
  type: 'goal' | 'assist';
  playerId: string;
  playerName: string;
  team: string;
  teamId: string;
  minute: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  timestamp: Date;
}
```

## 🎮 Fluxo de Uso da Aplicação

### 1. Autenticação
1. **Login**: Usuário faz login com email/senha
2. **Novo Usuário**: Registro + redirecionamento para onboarding
3. **Onboarding**: 4 etapas obrigatórias para completar perfil
4. **Acesso**: Redirecionamento para dashboard principal

### 2. Dashboard
- **Widget de Próximas Partidas**: Lista de jogos agendados
- **Stats Pessoais**: Resumo de estatísticas do jogador
- **Ações Rápidas**: Botões para funcionalidades principais
- **Notificações**: Centro de alertas e avisos

### 3. Partidas ao Vivo
1. **Seleção de Partida**: Escolher partida agendada com 15+ jogadores
2. **Sorteio de Times**: Algoritmo automático cria 3 times balanceados
3. **Seleção da Partida**: Escolher 2 times para jogar (1 fica esperando)
4. **Partida ao Vivo**:
   - Cronômetro de 7 minutos
   - Registro de gols/assistências
   - Placar em tempo real
   - Histórico de eventos
   - Fim automático (2 gols ou tempo esgotado)
5. **Fim da Partida**: Opção de nova partida ou voltar ao menu

### 4. Gestão de Perfil
- **Edição de Dados**: Informações pessoais e de futebol
- **Upload de Avatar**: Imagem de perfil com preview
- **Estatísticas**: Visualização de performance
- **Preferências**: Configurações de tema e notificações

## 🔧 Funcionalidades Técnicas

### Validação e Segurança
- **Zod Schemas**: Validação rigorosa de formulários
- **TypeScript Strict Mode**: Tipagem forte em todo o código
- **Route Protection**: Middleware automático de autenticação
- **Input Sanitization**: Limpeza automática de dados
- **Auditoria**: Registro completo de ações do usuário

### Performance e UX
- **Lazy Loading**: Carregamento sob demanda de componentes
- **React Query**: Cache inteligente de dados
- **Responsive Design**: Mobile-first, adaptável a todos os dispositivos
- **Animações Suaves**: Transições com Framer Motion
- **Loading States**: Feedback visual em todas as operações

### Persistência de Dados
- **LocalStorage**: Preferências e configurações
- **SessionStorage**: Dados temporários da sessão
- **Context API**: Estado em memória durante navegação
- **Mock Data**: Sistema completo de dados falsos para desenvolvimento

## 🎨 Design System

### Temas e Cores
- **Tema Claro**: Interface limpa com fundo branco
- **Tema Escuro**: Interface escura para uso noturno
- **Tema Automático**: Segue preferência do sistema
- **Cores Personalizadas**: Paleta consistente usando CSS variables

### Componentes UI
- **shadcn/ui**: Biblioteca de componentes base
- **Tailwind CSS**: Sistema de classes utilitárias
- **Lucide Icons**: Ícones consistentes e modulares
- **Componentes Customizados**: Extensões específicas do projeto

### Responsividade
```css
Breakpoints:
- sm: 640px+ (tablets)
- md: 768px+ (laptops)  
- lg: 1024px+ (desktops)
- xl: 1280px+ (telas grandes)
```

## 📊 Dados Mock para Desenvolvimento

### Usuários Demo
- 15 jogadores com diferentes posições e skill levels
- Admins e usuários regulares
- Perfis completos com avatars e estatísticas

### Partidas Demo
- Partidas agendadas, completadas e canceladas
- Diferentes horários e locais
- Resultados variados

### Times Pré-configurados
- Barcelona (vermelho/azul)
- Real Madrid (branco/preto)
- Manchester City (azul claro/azul escuro)

## 🔄 Estados da Aplicação

### Estados de Autenticação
- `isAuthenticated`: boolean
- `user`: User | null
- `isLoading`: boolean
- `isNewUser`: boolean (para onboarding)

### Estados de Partida ao Vivo
- `phase`: 'team-draw' | 'match-selection' | 'live-match' | 'match-ended'
- `teams`: Team[]
- `currentMatch`: objeto com times, placar, eventos, cronômetro
- `matchHistory`: histórico de partidas completadas

### Estados de UI
- `theme`: 'light' | 'dark' | 'auto'
- `sidebarOpen`: boolean
- `notifications`: Notification[]

## 🚀 Scripts de Desenvolvimento

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📋 Dependências Principais

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "typescript": "^5.x",
  "@tanstack/react-query": "^5.56.2",
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.8",
  "@hookform/resolvers": "^3.9.0",
  "tailwindcss": "^3.x",
  "framer-motion": "^12.15.0",
  "lucide-react": "^0.462.0",
  "recharts": "^2.12.7",
  "date-fns": "^4.1.0"
}
```

## 🎯 Pontos de Entrada da Aplicação

### Rotas Principais
```typescript
/login              # Página de login
/register           # Página de cadastro
/onboarding         # Processo de onboarding (4 etapas)
/                   # Dashboard principal (requer auth)
/profile            # Perfil do usuário
/players            # Lista de jogadores
/stats              # Estatísticas
/chat               # Chat (futuro)
/live-match/:id     # Partida ao vivo
/match/:id          # Detalhes da partida
```

### Componentes de Entrada
- `App.tsx`: Configuração de rotas e providers
- `main.tsx`: Ponto de entrada React
- `ProtectedRoute.tsx`: Middleware de autenticação

## 🔍 Sistema de Debug

### Console Logs
- `[AUTH]`: Logs de autenticação
- `[MATCH]`: Logs de partidas
- `[ERROR]`: Logs de erro
- Logs estruturados para facilitar debug

### Ferramentas de Desenvolvimento
- React Developer Tools
- TanStack Query Devtools
- TypeScript strict mode
- Vite hot reload

## 📈 Status do Projeto

### ✅ Implementado
- Sistema completo de autenticação
- Onboarding personalizado em 4 etapas
- Gestão avançada de perfil
- Sistema robusto de preferências
- Dashboard com widgets interativos
- Sistema completo de partidas ao vivo
- Sorteio automático de times
- Cronômetro e placar em tempo real
- Registro de eventos (gols/assistências)
- Sistema de notificações
- Auditoria completa de ações

### 🚧 Em Desenvolvimento
- Chat em tempo real
- Sistema avançado de estatísticas
- Funcionalidades sociais

### 📋 Futuro
- Integração com APIs externas
- Notificações push
- Sistema de ranking
- Torneios e campeonatos

## 💡 Conceitos Técnicos Importantes

### Padrões de Desenvolvimento
- **Functional Components**: Apenas componentes funcionais
- **Custom Hooks**: Lógica reutilizável extraída
- **Composition**: Preferência por composição
- **TypeScript First**: Tipagem rigorosa
- **Mobile First**: Design responsivo

### Gerenciamento de Estado
- **Context API**: Estado global sem Redux
- **Local State**: useState para estado local
- **Persistent State**: localStorage para persistência
- **Cache**: React Query para cache de dados

### Arquitetura de Componentes
- **Atomic Design**: Componentes pequenos e focados
- **Props Interface**: Tipagem rigorosa de props
- **Error Boundaries**: Tratamento de erros (futuro)
- **Lazy Loading**: Carregamento sob demanda

Este README fornece uma visão completa do projeto "Meu Raxa", suas funcionalidades, arquitetura técnica e como navegar pelo código. É uma aplicação robusta e bem estruturada para gestão de futebol amateur com foco em experiência do usuário e qualidade técnica.
