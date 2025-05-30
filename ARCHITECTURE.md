
# Arquitetura do Projeto - Meu Raxa

## 🏗️ Visão Geral da Arquitetura

Meu Raxa é uma aplicação web SPA (Single Page Application) construída com React e TypeScript, seguindo padrões modernos de desenvolvimento frontend.

## 🚀 Stack Tecnológica

### Frontend Core
- **React 18** + **TypeScript** - Framework principal com tipagem estática
- **Vite** - Build tool moderno e rápido
- **React Router DOM** - Roteamento SPA
- **Tailwind CSS** - Framework CSS utilitário

### UI/UX
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **Lucide React** - Biblioteca de ícones consistente
- **Framer Motion** - Animações e transições suaves
- **Radix UI** - Componentes headless para acessibilidade

### Estado e Dados
- **React Context API** - Gerenciamento de estado global
- **TanStack React Query** - Cache e sincronização de dados
- **Local Storage** - Persistência de dados do cliente

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários eficiente
- **Zod** - Validação de schema TypeScript-first
- **Hookform Resolvers** - Integração entre RHF e Zod

### Gráficos e Visualização
- **Recharts** - Biblioteca de gráficos responsivos
- **PDF.js** - Processamento de arquivos PDF

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base shadcn/ui
│   ├── auth/            # Componentes de autenticação
│   ├── onboarding/      # Fluxo de onboarding
│   ├── profile/         # Gestão de perfil
│   ├── dashboard/       # Widgets do dashboard
│   ├── notifications/   # Sistema de notificações
│   └── ...
├── contexts/            # Contextos React
│   ├── AppContext.tsx   # Context agregador principal
│   ├── UserContext.tsx  # Autenticação e usuários
│   ├── MatchContext.tsx # Gestão de partidas
│   ├── ChatContext.tsx  # Sistema de chat
│   ├── NotificationContext.tsx # Notificações
│   ├── PreferencesContext.tsx # Preferências do usuário
│   └── AuditContext.tsx # Auditoria de ações
├── pages/               # Páginas da aplicação
│   ├── Login.tsx        # Autenticação
│   ├── Register.tsx     # Cadastro
│   ├── Onboarding.tsx   # Onboarding
│   ├── Profile.tsx      # Perfil do usuário
│   ├── Index.tsx        # Dashboard/Partidas
│   └── ...
├── types/               # Definições TypeScript
│   ├── index.ts         # Tipos principais
│   ├── preferences.ts   # Tipos de preferências
│   ├── onboarding.ts    # Tipos de onboarding
│   ├── notifications.ts # Tipos de notificações
│   └── ...
├── hooks/               # Custom hooks
│   ├── useOnboarding.ts # Hook de onboarding
│   ├── useOnboardingProgress.ts # Progresso do onboarding
│   └── ...
├── utils/               # Utilitários
│   ├── auth.ts          # Helpers de autenticação
│   ├── validation.ts    # Validações de formulário
│   └── ...
└── data/                # Dados mock
    └── mockData.ts      # Dados de desenvolvimento
```

## 🎨 Padrões de Design

### Componentes
- **Functional Components**: Apenas componentes funcionais com hooks
- **Composição**: Preferência por composição sobre herança
- **Props Interface**: Tipagem rigorosa de props com TypeScript
- **Responsividade**: Mobile-first design

### Estado
- **Context API**: Para estado global da aplicação
- **Local State**: useState para estado local de componentes
- **Persistent State**: localStorage para dados que devem persistir

### Styling
- **Tailwind CSS**: Classes utilitárias para styling
- **shadcn/ui**: Componentes base pré-estilizados
- **CSS Variables**: Para temas e customização
- **Mobile First**: Design responsivo priorizando mobile

## 🔧 Principais Interfaces TypeScript

### Usuário e Autenticação
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  position: PlayerPosition;
  avatar: string;
  stats: UserStats;
  isAdmin?: boolean;
  age?: number;
  bio?: string;
  phone?: string;
  secondaryPositions?: PlayerPosition[];
  preferredFoot?: 'right' | 'left' | 'both';
  emergencyContact?: EmergencyContact;
  preferences?: UserPrivacyPreferences;
  isProfileComplete?: boolean;
}
```

### Onboarding
```typescript
interface OnboardingData {
  name: string;
  age: number | null;
  phone: string;
  position: PlayerPosition;
  secondaryPositions: PlayerPosition[];
  preferredFoot: 'right' | 'left' | 'both';
  yearsPlaying: number | null;
  avatar?: File;
  bio: string;
  emergencyContact: EmergencyContact;
}
```

### Partidas
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

## 🔒 Segurança e Permissões

### Níveis de Acesso
- **Administrador**: Acesso total a criação/edição de partidas
- **Usuário**: Edição do próprio perfil e participação em partidas
- **Visitante**: Apenas visualização (futuro)

### Validação
- **Client-Side**: Zod schemas para validação TypeScript
- **Input Sanitization**: Limpeza automática de dados
- **Route Protection**: Middleware de autenticação

## 📱 Responsividade

- **Mobile First**: Design otimizado para celulares
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Elementos otimizados para toque
- **Fluid Layout**: Layout que se adapta ao tamanho da tela

## 🔄 Fluxo de Dados

### Context Providers
1. **AppContext**: Context principal que agrega todos os outros
2. **UserContext**: Gerencia autenticação e dados do usuário
3. **MatchContext**: Gerencia partidas e estatísticas
4. **PreferencesContext**: Configurações do usuário
5. **NotificationContext**: Sistema de notificações

### Estado Local vs Global
- **Global**: Dados de usuário, partidas, preferências
- **Local**: Estados de UI, formulários, componentes temporários

## 📊 Performance

### Bundle Optimization
- **Tree Shaking**: Importação apenas do código necessário
- **Code Splitting**: Carregamento sob demanda de rotas
- **Lazy Loading**: Componentes carregados dinamicamente

### Caching
- **React Query**: Cache inteligente de dados
- **localStorage**: Persistência de preferências
- **Browser Cache**: Assets estáticos otimizados
