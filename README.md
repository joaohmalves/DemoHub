# Cognigy AI Agent Demo Hub

Ferramenta interna para centralizar demos comerciais de agentes Cognigy: catálogo de agentes, widget de chat/voice ao vivo, diagrama de fluxo e roteiro de demonstração, tudo em um único workspace.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Login de exemplo: `ae1` / `cognigy2024` (ver `src/data/users.ts`).

```bash
npm run build     # build de produção em dist/
npm run preview   # serve o build de produção localmente
```

## Arquitetura

- **React + Vite + TypeScript + React Router**, sem backend. Autenticação e catálogo de agentes vivem no frontend.
- **CSS Modules** com um `tokens.css` central (cores, espaçamento, raio, sombra) como design system leve.
- `services/auth.ts` isola a lógica de sessão (sessionStorage) para que, no futuro, virar uma API real seja uma troca localizada sem tocar em componentes de UI.
- `data/agents.ts` é a fonte única de verdade do catálogo — nenhum componente precisa mudar para adicionar um agente.
- Os widgets oficiais da Cognigy (`CognigyChatEmbed`, `CognigyVoiceEmbed`) injetam o `<script>` oficial via DOM API (`document.createElement('script')`), porque o React não executa `<script>` inserido via `innerHTML`. O componente é remontado (via `key`) a cada troca de aba/agente para evitar estado ou listeners de uma sessão anterior vazando para a próxima demo.

## Onde cadastrar um novo agente

Edite `src/data/agents.ts` e adicione um novo objeto ao array `agents`. Coloque as imagens em `public/agents/<id>/card.svg` (ou .png/.webp) e `flow.svg`. Nenhum componente React precisa ser alterado.

## Onde configurar os endpoints Cognigy

No mesmo objeto do agente em `src/data/agents.ts`, dentro de `cognigy.chatEndpoint` e `cognigy.voiceEndpoint`. Se um endpoint ficar vazio, a aba correspondente mostra "coming soon" em vez de quebrar.

> **Nota de segurança:** esses endpoints não são secrets — eles precisam ser enviados ao browser para inicializar os widgets. A autenticação do Hub protege o acesso à interface, não os endpoints em si.

## Onde adicionar imagens

`public/agents/<id>/` — `card.svg` (usado no card do catálogo) e `flow.svg` (usado no diagrama de fluxo com zoom). Os arquivos atuais são placeholders gerados; substitua pelos assets reais quando disponíveis. Prefira WebP/SVG para manter o carregamento leve.

## Onde alterar o roteiro de demonstração

Também em `src/data/agents.ts`, no campo `demoScript` de cada agente: `introduction`, `suggestedQuestions` (lista somente leitura) e `scenarios` (cada um com `title`, `objective`, `prompt`, `expectedBehavior`).

## Login / credenciais

Lista estática em `src/data/users.ts`. É controle de acesso interno, não segurança forte — qualquer pessoa com acesso ao bundle JS pode ler essas credenciais. Adequado para o escopo desta fase (ferramenta interna, sessão expira ao fechar a aba).

## Estrutura de pastas

```text
src/
  pages/                 # Login, DemoHub, Agent, NotFound
  components/
    layout/              # AppShell, Header
    agents/               # AgentCard, AgentGrid, IndustryFilter
    agent-workspace/       # LiveDemoPanel, embeds Cognigy, FlowViewer, DemoScript, SuggestedQuestions
    common/               # Button, Badge, Modal
    ProtectedRoute.tsx
  data/agents.ts          # catálogo — fonte de verdade
  data/users.ts           # credenciais estáticas
  services/auth.ts        # sessão/login/logout
  types/agent.ts
  styles/tokens.css, global.css
```
