
# ⚽ Meu Raxa

**Plataforma moderna para gestão de futebol amateur**

## 🎯 Sobre o Projeto

Meu Raxa é um aplicativo web completo para organizar partidas de futebol amateur, permitindo que jogadores se conectem, confirmem presença, acompanhem estatísticas e interajam através de um sistema integrado. Com foco na experiência do usuário e design responsivo, oferece todas as ferramentas necessárias para gerenciar sua pelada.

## ✨ Principais Funcionalidades

### 🔐 Sistema de Autenticação
- Login/registro completo com validação
- Recuperação de senha por email
- Sessão persistente e proteção de rotas

### 🎯 Onboarding Personalizado
- Processo guiado em 4 etapas
- Upload de avatar com preview
- Validação em tempo real
- Progresso salvo automaticamente

### 👤 Gestão de Perfil
- Informações pessoais e de futebol
- Upload de foto e biografia
- Dados de emergência
- Configurações de privacidade

### ⚙️ Sistema de Preferências
- Tema claro/escuro/automático
- Notificações personalizáveis
- Layout de dashboard configurável
- Persistência local de configurações

## 🚀 Tecnologias

**Frontend**: React 18 + TypeScript + Vite  
**UI/UX**: Tailwind CSS + shadcn/ui + Framer Motion  
**Estado**: Context API + TanStack React Query  
**Formulários**: React Hook Form + Zod  
**Gráficos**: Recharts

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Context API (estado global)
├── pages/              # Páginas da aplicação
├── types/              # Definições TypeScript
├── hooks/              # Custom hooks
├── utils/              # Funções utilitárias
└── data/               # Dados mock para desenvolvimento
```

## 🔧 Como Executar

### Pré-requisitos
- Node.js 18+ ou Bun
- NPM, Yarn ou Bun

### Instalação
```bash
# Clonar repositório
git clone [url-do-repositorio]
cd meu-raxa

# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Verificação de código
```

## 📋 Status de Desenvolvimento

### ✅ Implementado
- Sistema completo de autenticação
- Onboarding personalizado com 4 etapas
- Gestão avançada de perfil de usuário
- Sistema robusto de preferências
- Infraestrutura técnica (Context API, validações, auditoria)

### 🚧 Em Desenvolvimento
- Dashboard interativo com widgets
- Sistema de notificações avançado
- Drag & drop para personalização de layout

### 📋 Planejado
- Sistema completo de partidas
- Estatísticas e gráficos interativos
- Chat em tempo real
- Funcionalidades sociais

## 📚 Documentação

- **[Arquitetura](ARCHITECTURE.md)** - Estrutura técnica e padrões
- **[Contribuição](CONTRIBUTING.md)** - Guia para desenvolvedores
- **[API](API.md)** - Documentação de serviços e dados
- **[Roadmap](ROADMAP.md)** - Plano de desenvolvimento

## 🤝 Contribuindo

Interessado em contribuir? Consulte nosso [Guia de Contribuição](CONTRIBUTING.md) para conhecer nossos padrões de código e processo de desenvolvimento.

## 📊 Performance

- **Lighthouse Score**: 90+ em todas as métricas
- **Bundle Size**: Otimizado com tree-shaking
- **Mobile First**: Design responsivo e touch-friendly
- **Acessibilidade**: Seguindo padrões WCAG

## 🔒 Segurança

- Validação rigorosa de dados (client-side)
- Sanitização automática de inputs
- Auditoria completa de ações
- Proteção de rotas baseada em permissões

## 📱 Responsividade

Design mobile-first com breakpoints otimizados:
- **sm**: 640px+ (tablets)
- **md**: 768px+ (laptops)
- **lg**: 1024px+ (desktops)
- **xl**: 1280px+ (telas grandes)

## 🚀 Deploy

- **Desenvolvimento**: Lovable Platform
- **Produção**: Deploy automático via GitHub
- **Domínio Personalizado**: Suporte disponível

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para a comunidade de futebol amateur**

⚽ **Versão**: 2.0.0 | **Status**: Em desenvolvimento ativo
