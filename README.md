# BioLab Evolution

BioLab Evolution é uma aplicação web educacional que simula a trajetória de um cientista em biotecnologia. O projeto integra conteúdo teórico, experimentação prática gamificada e progressão por conquistas e patentes.

**Objetivos**
- Promover aprendizado ativo sobre procedimentos laboratoriais (PCR, cultivo celular, fermentação, sequenciamento e CRISPR).
- Reforçar conceitos através de quizzes, minigames e gerenciamento de recursos.
- Oferecer um ambiente responsivo e acessível para uso em sala de aula.

**Principais Funcionalidades**
- Quizzes teóricos para desbloqueio dos minigames.
- Cinco minigames alinhados a procedimentos reais.
- Loja de equipamentos com requisitos e efeitos no gameplay.
- Sistema de conquistas com notificações globais.
- Patentes com requisitos, progresso, histórico e renda passiva.
- Cabeçalho responsivo com indicadores (Conhecimento, Financiamento, Reputação).
- Ranking global com layout compatível com dispositivos móveis.

## Tecnologias
- React (Hooks, Context API)
- React Router DOM
- Tailwind CSS
- Lucide React (ícones)
- Supabase (integração preparada) e LocalStorage

## Arquitetura
```
src/
├── components/         Componentes reutilizáveis
│   ├── common/         Modal, botão, carregadores
│   ├── experiments/    Experimentos e minigames
│   ├── lab/            Bancada e elementos do laboratório
│   ├── layout/         Header, Navigation, Footer
│   ├── progress/       Estatísticas e conquistas
│   ├── quiz/           Sistema de perguntas
│   └── shop/           Loja de equipamentos
├── contexts/           Estados globais (Game, Auth)
├── data/               JSON estáticos (patentes, etc.)
├── pages/              Páginas de rota
├── services/           Lógica de domínio e integrações
├── styles/             CSS global e variáveis
└── utils/              Funções auxiliares e constantes
```

## Instalação e Execução
```
npm install
npm start
```
Aplicação em http://localhost:3000

## Build e Testes
```
npm run build
npm test
```

## Deploy
- Compatível com Vercel (Create React App). O comando de build é detectado automaticamente e a pasta de saída é build/.

## Atualizações Recentes
- Integração completa dos cinco minigames no fluxo de experimentos.
- Sistema de notificações para eventos de conquistas e patentes.
- Patentes com barra de progresso, histórico de ativações e renda passiva.
- Balanceamento por nível para custos de equipamentos e rendas de patentes.
- Header otimizado para exibir indicadores no modo mobile.
- Ranking com tabela responsiva e rolagem horizontal em telas pequenas.

## Manual do Usuário
Consulte o documento [MANUAL_DO_USUARIO.md](./MANUAL_DO_USUARIO.md) para orientações detalhadas de uso e estudo.

## Autor
Desenvolvido por FelipeDev para fins educacionais (Projeto Integrador).
