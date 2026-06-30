# Kicker Hax - Next-Gen Online Arena

Kicker Hax é um jogo multiplayer de futebol de botão (Haxball style) com física em tempo real, suporte a bots (CPU) e integração persistente de perfil e ranking com o Firebase.

Esta versão representa uma reestruturação completa, dividindo o antigo monolítico em uma arquitetura limpa MVC separando as lógicas do cliente (Vite SPA) e do servidor em tempo real (Socket.IO em RAM).

---

## 🛠️ Tecnologias Utilizadas

### Cliente (Frontend)
- **Vite + Vanilla JS (ES Modules)**: Construção modular e carregamento rápido sem frameworks pesados.
- **HTML5 Canvas**: Renderização acelerada em 2D para a partida e efeitos gráficos.
- **Vanilla CSS**: Estilização responsiva moderna com efeitos de blur (glassmorphism), animações de pulso de neon e ripples.
- **Firebase Client SDK (Auth & Firestore)**: Controle de sessões e salvamento de estatísticas persistentes de perfil.
- **Gamepad API**: Conexão nativa e remapeável de controles (Xbox/PlayStation/Genéricos).
- **Web Audio API**: Sintetização sonora de efeitos (apitos, chutes, torcida) sem carregar arquivos pesados.

### Servidor (Backend)
- **Node.js + Express**: Servidor HTTP para servir a aplicação estática.
- **Socket.IO (WebSockets)**: Sincronização em tempo real de inputs e estados físicos da partida com latência extremamente baixa.
- **Memória RAM (In-Memory Database)**: Todas as lógicas de salas e física da partida rodam inteiramente em memória para máxima velocidade de resposta.

---

## 📂 Estrutura de Pastas

```
/backup             # Backup dos arquivos originais do projeto (monolítico antigo)
/client
    /assets         # Recursos de imagem e som
    /components     # Elementos visuais reutilizáveis
    /controllers    # Controladores de Visualizações (Auth, Menu, Game, Settings)
    /models         # Classes de renderização da Bola e Jogador do lado do cliente
    /styles         # Main, Screens e Game stylesheets (estilos responsivos)
    /utils          # Sons sintéticos (soundFx) e graphemes de emojis
    /services       # Serviços de conexões (Firebase, Socket, Gamepad)
    index.html      # Contêiner SPA central
    main.js         # Inicializador do cliente Vite
    router.js       # Roteador SPA de alto desempenho

/server
    /database       # Banco de dados temporário em RAM (Rooms/Sockets)
    /models         # Room, Match (loop 60Hz) e PhysicsEngine autoritários
    /sockets        # Ouvintes de eventos do Socket.IO (lobby e partida)
    server.js       # Entrypoint do servidor Express + Socket.IO

/shared
    constants.js    # Constantes físicas unificadas entre cliente e servidor
```

---

## 📐 Arquitetura & Fluxo do Jogo

O jogo foi estruturado utilizando o padrão **MVC (Model-View-Controller)** para separar visualizações, lógica de negócio e estados físicos:

1. **Roteamento SPA**: O `router.js` gerencia as transições de tela manipulando classes CSS `.hidden` de forma instantânea.
2. **Ciclo de Vida das Telas**:
   - O controlador correspondente (`authController`, `menuController`, etc.) inicializa os inputs e renderiza dados dinâmicos ao entrar em cada tela.
3. **Loop Físico do Servidor (Multiplayer)**:
   - Os clientes enviam apenas dados de *inputs* (direção, chutar, habilidades).
   - O servidor processa a física de colisões em 60Hz e devolve *snapshots* de posições de forma autoritária.
   - O cliente renderiza interpolando suavemente (LERP) as posições dos demais jogadores, garantindo fluidez mesmo sob oscilações de ping.

---

## 🔒 Autenticação & Dados Persistentes

O Firebase é o único responsável pelos dados persistentes:
- **Autenticação**: Cadastro, Login e Recuperação de senha integrados.
- **Dados do Perfil**: Documentos na coleção `/users` (username único, displayName, badge/emoji de avatar, nível de XP).
- **Estatísticas**: Documentos na coleção `/stats` (partidas jogadas, vitórias, gols, taxa de vitórias).
- **Match History**: Coleção `/history` registrando logs imutáveis pós-jogo.

*O arquivo [firestore.rules](firestore.rules) contém as regras de segurança necessárias para colar no console do Firebase e proteger as coleções contra modificações não autorizadas.*

---

## 🤖 Inteligência Artificial (Bot CPU)

A IA do bot de futebol foi totalmente reformulada:
- **Previsão de Trajetória**: Analisa velocidade e fricção da bola para se posicionar preventivamente à frente.
- **Níveis de Dificuldade**:
  - *Fácil*: Reações lentas e sem uso de habilidades.
  - *Médio*: Segue a bola de perto e chuta ao gol.
  - *Difícil*: Marcação individual agressiva, dribles com dash de velocidade e chutes com efeito (power shoot).
- **Erros Humanos**: A IA simula pressões psicológicas; quando sob marcação de um jogador humano próximo, a CPU pode errar passes, tackles ou chutar com desvio.

---

## 🎮 Controles & Gamepad

- **Mapeamento de Teclas**: Permite configurar botões separados para andar, correr, chutar, driblar, tackle (desarme) e power.
- **Troca Inteligente (Swap)**: Impedimentos automáticos de teclas em uso e troca automática de comandos para o mesmo jogador.
- **Gamepad API**: Detecção automática de controles e remapeamento completo dos botões.

---

## 🚀 Como Instalar e Executar

### Pré-requisitos
- Node.js instalado (versão 18 ou superior).
- Conta no Firebase com Firestore ativado.

### Instalação
1. Clone este repositório:
   ```bash
   git clone https://github.com/devhugo-os/Kicker-Hax.git
   cd Kicker-Hax
   ```
2. Instale as dependências na raiz do projeto:
   ```bash
   npm install
   ```

### Execução Local (Modo Desenvolvedor)
1. Rode o comando unificado de desenvolvimento:
   ```bash
   npm run dev
   ```
   - O **servidor de WebSockets** iniciará em: `http://localhost:8080`
   - O **cliente de desenvolvimento Vite** iniciará em: `http://localhost:3000`

2. Abra `http://localhost:3000` no seu navegador para testar o jogo.

### Compilação de Produção
Para compilar o cliente em arquivos estáticos minificados servidos diretamente pelo Express:
```bash
npm run client:build
npm start
```
O servidor de produção rodará completo em `http://localhost:8080`.

---

## 🤝 Como Contribuir

1. Leia as regras locais detalhadas no arquivo `AGENTS.md` (regras de commits, documentação e estrutura).
2. Faça um Fork do projeto.
3. Crie uma branch com a sua modificação: `git checkout -b feature/minha-feature`
4. Faça commits incrementais explicativos.
5. Abra um Pull Request detalhando as alterações.

---

## 🗺️ Roadmap Futuro

- [ ] **Cosméticos e Loja**: Estrutura preparada para compra de skins de botões, trilhas de bola e efeitos de gols personalizados.
- [ ] **Campeonatos Online**: Criação de chaves de chaves eliminatórias integradas via lobbies de torneios.
- [ ] **Partidas 2x2 e 3x3**: Suporte no loop físico do servidor para sincronização de múltiplos jogadores no mesmo time de forma simultânea.
