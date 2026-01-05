# 🧬 BioLab Evolution

> **Um simulador de laboratório de biotecnologia gamificado.**
> Desenvolvido por **FelipeDev**.

O **BioLab Evolution** é uma aplicação web interativa desenvolvida em React que simula a carreira de um cientista em biotecnologia. O jogo combina mecânicas de aprendizado (quizzes), gestão de recursos (compra de equipamentos) e minigames práticos que simulam procedimentos reais de laboratório (PCR, Cultura Celular, CRISPR, etc.).

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com uma stack moderna e robusta:

*   **Frontend**: [React 19](https://react.dev/) (Hooks, Context API)
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/) (Design responsivo e moderno)
*   **Ícones**: [Lucide React](https://lucide.dev/)
*   **Roteamento**: [React Router DOM](https://reactrouter.com/)
*   **Gerenciamento de Estado**: React Context API (`GameContext`, `AuthContext`)
*   **Backend / Persistência**: Supabase (Integração preparada) & LocalStorage

---

## 📂 Estrutura do Projeto

A organização das pastas segue uma arquitetura modular para facilitar a manutenção e escalabilidade:

```bash
src/
├── components/         # Componentes React reutilizáveis
│   ├── common/         # Botões, Modais, Loaders genéricos
│   ├── experiments/    # Lógica e UI dos Experimentos
│   │   └── minigames/  # Os 5 minigames principais (PCR, CRISPR, etc.)
│   ├── lab/            # Componentes da Bancada Principal
│   ├── layout/         # Header, Footer, Navigation
│   ├── progress/       # Gráficos de estatísticas e conquistas
│   ├── quiz/           # Sistema de perguntas e respostas
│   └── shop/           # Loja de equipamentos
├── contexts/           # Estados Globais (Game, Auth, Theme)
├── data/               # Arquivos JSON estáticos (perguntas, equipamentos, história)
├── hooks/              # Custom Hooks (useGame, useSound, etc.)
├── pages/              # Visualizações de Rota (Pages)
├── services/           # Lógica de negócios e chamadas de API
├── styles/             # Configurações globais de CSS
└── utils/              # Funções auxiliares e constantes
```

---

## 🛠️ Como Executar Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

1.  **Clone o repositório** (ou baixe os arquivos):
    ```bash
    git clone https://github.com/seu-usuario/biolab-evolution.git
    cd biolab-evolution
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm start
    ```
    O jogo abrirá automaticamente em `http://localhost:3000`.

---

## ☁️ Como Fazer Deploy na Vercel

Este projeto está pronto para ser hospedado na Vercel com zero configuração complexa.

1.  Crie uma conta na [Vercel](https://vercel.com/).
2.  Instale a Vercel CLI (opcional) ou conecte seu repositório GitHub.
3.  **Via Dashboard da Vercel**:
    *   Clique em "Add New Project".
    *   Importe o repositório do GitHub.
    *   Em "Framework Preset", selecione **Create React App**.
    *   Clique em **Deploy**.

A Vercel detectará automaticamente o comando de build (`npm run build`) e a pasta de saída (`build/`).

---

## 📖 Manual do Usuário

Para entender as mecânicas do jogo, objetivos e como jogar cada minigame, consulte o arquivo:
👉 [**MANUAL_DO_USUARIO.md**](./MANUAL_DO_USUARIO.md)

---

## 👨‍💻 Autor

Desenvolvido com ❤️ e muito café por **FelipeDev**.
*Fins educacionais - Projeto Integrador.*
