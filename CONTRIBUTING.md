
# Contribuindo para o Meu Raxa

## 🤝 Como Contribuir

Agradecemos seu interesse em contribuir para o Meu Raxa! Este guia irá ajudá-lo a começar.

## 📋 Padrões de Código

### Convenções de Nomenclatura
- **Componentes**: PascalCase (`UserProfile`, `MatchCard`)
- **Variáveis e Funções**: camelCase (`userName`, `handleSubmit`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_PLAYERS`, `API_URL`)
- **Arquivos**: kebab-case ou PascalCase para componentes

### Estrutura de Componentes
```typescript
// Imports
import React from 'react';
import { ComponentProps } from './types';

// Interface/Types
interface Props {
  // props definition
}

// Component
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // hooks
  // handlers
  // render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### TypeScript Guidelines
- **Strict Mode**: Sempre use TypeScript em modo strict
- **Interfaces**: Prefira interfaces sobre types para objetos
- **Generics**: Use quando necessário para flexibilidade
- **Avoid Any**: Evite `any`, use `unknown` quando necessário

### Styling Guidelines
- **Tailwind First**: Use Tailwind CSS para styling
- **Responsive**: Sempre implemente design responsivo
- **Dark Mode**: Considere suporte a modo escuro
- **Acessibilidade**: Siga padrões WCAG

## 🏗️ Estrutura de Desenvolvimento

### Criação de Componentes
1. **Componentes Pequenos**: Máximo 50 linhas quando possível
2. **Single Responsibility**: Um componente, uma responsabilidade
3. **Composição**: Prefira composição sobre herança
4. **Props Interface**: Sempre defina interfaces para props

### Custom Hooks
```typescript
// hooks/useCustomHook.ts
import { useState, useEffect } from 'react';

export const useCustomHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  
  // logic here
  
  return { value, setValue };
};
```

### Context Pattern
```typescript
// contexts/CustomContext.tsx
interface ContextType {
  // define context shape
}

const CustomContext = createContext<ContextType | undefined>(undefined);

export const useCustomContext = () => {
  const context = useContext(CustomContext);
  if (!context) {
    throw new Error('useCustomContext must be used within CustomProvider');
  }
  return context;
};
```

## 🔧 Setup de Desenvolvimento

### Pré-requisitos
- Node.js 18+ ou Bun
- NPM, Yarn ou Bun

### Instalação
```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd meu-raxa

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

## 📝 Processo de Contribuição

### 1. Issues
- **Bug Reports**: Use o template de bug report
- **Feature Requests**: Descreva a funcionalidade desejada
- **Documentação**: Melhorias na documentação são bem-vindas

### 2. Pull Requests
1. **Fork** o repositório
2. **Crie uma branch** para sua feature (`feature/nova-funcionalidade`)
3. **Faça commits** seguindo conventional commits
4. **Teste** suas mudanças
5. **Abra um PR** com descrição detalhada

### 3. Conventional Commits
```
feat: Nova funcionalidade
fix: Correção de bug
refactor: Refatoração de código
style: Mudanças de estilo/UI
docs: Documentação
test: Testes
chore: Tarefas de manutenção
```

## 🧪 Testes

### Padrões de Teste
- **Unit Tests**: Para funções utilitárias
- **Component Tests**: Para componentes React
- **Integration Tests**: Para fluxos completos

### Ferramentas
- **Testing Library**: Para testes de componentes
- **Jest**: Framework de testes
- **MSW**: Mock de APIs

## 📚 Documentação

### Documentação de Código
- **JSDoc**: Para funções complexas
- **README**: Para módulos importantes
- **Type Definitions**: Interfaces bem documentadas

### Documentação de Features
- **Storybook**: Para componentes UI
- **Markdown**: Para guias e tutoriais
- **Screenshots**: Para mudanças visuais

## 🔍 Code Review

### Checklist do Reviewer
- [ ] Código segue os padrões estabelecidos
- [ ] Funcionalidade está testada
- [ ] Documentação foi atualizada
- [ ] Performance não foi impactada
- [ ] Acessibilidade foi considerada

### Checklist do Autor
- [ ] Testes passando
- [ ] Linting sem erros
- [ ] Build funcionando
- [ ] Documentação atualizada
- [ ] Screenshots para mudanças visuais

## 🚀 Deploy e Release

### Processo de Release
1. **Teste** em ambiente de desenvolvimento
2. **Code Review** aprovado
3. **Merge** para branch principal
4. **Deploy** automático via CI/CD

### Versionamento
- **Semantic Versioning**: Major.Minor.Patch
- **Changelog**: Manter histórico de mudanças
- **Tags**: Marcar releases importantes

## 💡 Dicas Importantes

### Performance
- **Lazy Loading**: Use React.lazy para componentes pesados
- **Memoization**: Use React.memo quando apropriado
- **Bundle Size**: Monitore o tamanho do bundle

### Acessibilidade
- **Semantic HTML**: Use elementos semânticos
- **ARIA Labels**: Adicione labels quando necessário
- **Keyboard Navigation**: Teste navegação por teclado

### Mobile
- **Touch Targets**: Botões com pelo menos 44px
- **Responsive Design**: Teste em diferentes tamanhos
- **Performance**: Otimize para conexões lentas

## 🆘 Precisa de Ajuda?

- **Discord**: [Link do Discord da comunidade]
- **Issues**: Abra uma issue no GitHub
- **Documentação**: Consulte a documentação técnica
- **Code Review**: Peça ajuda nos PRs

Obrigado por contribuir para o Meu Raxa! 🚀⚽
