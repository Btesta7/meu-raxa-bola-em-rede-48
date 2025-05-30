
# Meu Raxa - Aplicativo de Gestão de Futebol Amateur

## Visão Geral

Meu Raxa é um aplicativo web moderno para gerenciar partidas de futebol amateur, permitindo que jogadores se organizem, confirmem presença, acompanhem estatísticas e interajam através de um sistema de chat. O projeto inclui sistema completo de autenticação, onboarding personalizado e gestão avançada de preferências.

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação Completo
- **Login e Registro**: Sistema robusto com validação de email e senha
- **Recuperação de Senha**: Fluxo completo de reset de senha por email
- **Proteção de Rotas**: Middleware de autenticação automática
- **Sessão Persistente**: Opção "Lembrar-me" com armazenamento seguro
- **Auditoria**: Log completo de ações de login/logout

### 🎯 Sistema de Onboarding Inteligente
- **Processo Guiado**: 4 etapas progressivas para completar o perfil
- **Validação Dinâmica**: Verificação em tempo real dos dados inseridos
- **Upload de Avatar**: Sistema de upload e preview de imagens
- **Progresso Salvo**: Continuação do onboarding de onde parou
- **Experiência Responsiva**: Interface adaptada para todos os dispositivos

### 👤 Gestão Avançada de Perfil
- **Informações Pessoais**: Nome, idade, telefone, biografia
- **Dados de Futebol**: Posição principal, posições secundárias, pé preferido
- **Contato de Emergência**: Sistema completo de dados de emergência
- **Avatar Personalizado**: Upload e gerenciamento de foto de perfil
- **Preferências de Privacidade**: Configurações de visibilidade

### ⚽ Sistema de Partidas
- **Criação de Partidas**: Interface intuitiva para administradores
- **Confirmação de Presença**: Sistema de RSVP com contadores
- **Sorteio de Times**: Algoritmo automático de balanceamento
- **Registro de Resultados**: Acompanhamento de placares e estatísticas
- **Status Dinâmico**: Agendada, completada ou cancelada

### 📊 Estatísticas e Análises
- **Estatísticas Individuais**: Gols, assistências, cartões, presença
- **Gráficos Interativos**: Visualização de desempenho com Recharts
- **Importação de Dados**: Sistema de upload via CSV
- **Histórico Completo**: Acompanhamento de todas as partidas

### 💬 Sistema de Chat em Tempo Real
- **Mensagens Instantâneas**: Chat entre todos os jogadores
- **Histórico Persistente**: Armazenamento de conversas
- **Interface Moderna**: Design responsivo e intuitivo

### 🔔 Sistema de Notificações
- **Notificações em Tempo Real**: Alertas para eventos importantes
- **Configurações Personalizáveis**: Controle granular de preferências
- **Centro de Notificações**: Interface centralizada de gerenciamento

### ⚙️ Sistema de Preferências
- **Tema**: Modo claro, escuro ou automático
- **Notificações**: Configurações detalhadas por categoria
- **Layout do Dashboard**: Widgets personalizáveis e reordenáveis
- **Idioma e Fuso Horário**: Suporte a localização
- **Reset de Configurações**: Volta aos padrões facilmente

## 🚀 Tecnologias Utilizadas

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

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS

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

## 🎨 Design System

### Temas e Cores
- **Modo Claro/Escuro**: Suporte completo a temas
- **Cores Primárias**: Verde para ações principais
- **Hierarquia Visual**: Sistema consistente de cores e tipografia

### Componentes
- **Responsividade**: Mobile-first design
- **Acessibilidade**: Seguindo padrões WCAG
- **Consistência**: Design system unificado

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

interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
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

### Preferências
```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
  dashboardLayout: DashboardWidget[];
  onboardingCompleted: boolean;
  language: string;
  timezone: string;
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

## 📋 Estado Atual das Funcionalidades

### ✅ Implementado e Funcional
- [x] **Sistema de Autenticação Completo**
  - [x] Login com email/senha
  - [x] Registro de novos usuários
  - [x] Recuperação de senha
  - [x] Proteção de rotas
  - [x] Sessão persistente

- [x] **Onboarding Personalizado**
  - [x] 4 etapas progressivas
  - [x] Upload de avatar
  - [x] Validação em tempo real
  - [x] Salvamento de progresso

- [x] **Gestão de Perfil**
  - [x] Edição completa de dados
  - [x] Upload de foto
  - [x] Configurações de privacidade
  - [x] Dados de emergência

- [x] **Sistema de Preferências**
  - [x] Configurações de tema
  - [x] Preferências de notificação
  - [x] Layout personalizável
  - [x] Persistência local

- [x] **Infraestrutura Base**
  - [x] Context API estruturado
  - [x] Validação de formulários
  - [x] Sistema de auditoria
  - [x] Tratamento de erros

### 🚧 Parcialmente Implementado
- [~] **Dashboard Personalizado**
  - [x] Estrutura de widgets
  - [ ] Drag & Drop para reordenação
  - [ ] Configuração avançada de widgets

- [~] **Sistema de Notificações**
  - [x] Estrutura base
  - [x] Configurações
  - [ ] Notificações push
  - [ ] Integração com eventos

### 📋 Próximas Funcionalidades
- [ ] **Widgets Interativos**
  - [ ] Estatísticas em tempo real
  - [ ] Gráficos de performance
  - [ ] Calendário integrado

- [ ] **Funcionalidades Sociais**
  - [ ] Sistema de amizades
  - [ ] Comentários em partidas
  - [ ] Ranking de jogadores

- [ ] **Integrações Externas**
  - [ ] API de clima
  - [ ] Mapas para localizações
  - [ ] Exportação de dados

## 🔒 Segurança e Permissões

### Níveis de Acesso
- **Administrador**: Acesso total a criação/edição de partidas
- **Usuário**: Edição do próprio perfil e participação em partidas
- **Visitante**: Apenas visualização (futuro)

### Validação e Sanitização
- **Input Sanitization**: Limpeza automática de dados
- **Validação Client-Side**: Zod schemas para TypeScript
- **Auditoria**: Log de todas as ações importantes

## 📱 Responsividade

- **Mobile First**: Design otimizado para celulares
- **Breakpoints**: sm, md, lg, xl para diferentes telas
- **Touch Friendly**: Elementos otimizados para toque
- **Performance**: Carregamento otimizado em conexões lentas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ ou Bun
- NPM, Yarn ou Bun como gerenciador de pacotes

### Instalação
```bash
# Clonar o repositório
git clone [url-do-repositorio]

# Instalar dependências
npm install
# ou
bun install

# Iniciar desenvolvimento
npm run dev
# ou
bun dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Verificação de código
```

## 🔄 Versionamento e Deploy

### Controle de Versão
- **Git**: Controle de versão distribuído
- **GitHub**: Hospedagem do código
- **Conventional Commits**: Padrão de commits

### Deploy
- **Lovable Platform**: Deploy automático
- **Custom Domain**: Suporte a domínio personalizado
- **CI/CD**: Integração contínua via GitHub Actions

## 🤝 Contribuição

### Para Desenvolvedores
1. **Analise o código existente** antes de fazer alterações
2. **Mantenha a consistência** com os padrões estabelecidos
3. **Use TypeScript** corretamente seguindo as interfaces
4. **Teste as funcionalidades** após implementar
5. **Mantenha os contextos organizados**

### Padrões de Código
- **Componentes**: Functional components com hooks
- **Estado**: Context API para estado global
- **Styling**: Tailwind CSS + shadcn/ui
- **Tipos**: TypeScript rigoroso
- **Nomenclatura**: camelCase para variáveis, PascalCase para componentes

### Estrutura de Commits
```
feat: Nova funcionalidade
fix: Correção de bug
refactor: Refatoração de código
style: Mudanças de estilo/UI
docs: Documentação
test: Testes
```

## 📈 Roadmap de Desenvolvimento

### Fase 1 - Fundação ✅
- Sistema de autenticação
- Onboarding personalizado
- Gestão básica de perfil
- Estrutura de preferências

### Fase 2 - Funcionalidades Core 🚧
- Dashboard interativo
- Sistema de notificações avançado
- Widgets personalizáveis
- Melhoria na UX mobile

### Fase 3 - Funcionalidades Sociais 📋
- Sistema de amizades
- Comentários e reações
- Ranking e conquistas
- Chat em grupos

### Fase 4 - Integrações 🔮
- API de clima para partidas
- Integração com calendários
- Exportação de dados
- API pública

## 📊 Métricas e Performance

### Bundle Size
- **Otimizado**: Tree-shaking automático
- **Code Splitting**: Carregamento sob demanda
- **Lazy Loading**: Componentes pesados

### Performance
- **Lighthouse Score**: 90+ em todas as métricas
- **Core Web Vitals**: Otimizado para UX
- **Mobile Performance**: Prioridade em dispositivos móveis

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
VITE_APP_NAME=Meu Raxa
VITE_API_URL=https://api.meuraxa.com
VITE_ENABLE_ANALYTICS=true
```

### Configuração de Build
- **Vite**: Build tool otimizado
- **TypeScript**: Checagem estrita de tipos
- **ESLint**: Regras de código rigorosas
- **PostCSS**: Processamento CSS avançado

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Time de Desenvolvimento

Desenvolvido com ❤️ para a comunidade de futebol amateur.

---

**Versão Atual**: 2.0.0  
**Última Atualização**: Dezembro 2024  
**Status**: Em desenvolvimento ativo 🚀
