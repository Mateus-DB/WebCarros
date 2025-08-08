
# 🚗 WebCarros

**WebCarros** é uma plataforma para compra e venda de carros novos e usados. O usuário pode criar uma conta, cadastrar veículos, visualizar anúncios, ver detalhes dos carros e entrar em contato diretamente com o vendedor.

## ✨ Funcionalidades

- **Cadastro e login de usuários**
- **Listagem de todos os carros** disponíveis na página inicial
- **Dashboard do usuário** com:
  - Lista de carros cadastrados
  - Formulário para cadastrar um novo carro
- **Página de detalhes do carro**, com informações completas e opção de contato com o vendedor
- **Mensagens personalizadas** via *toast*
- **Validação de formulários** com *schema validation*

## 🛠 Tecnologias Utilizadas

- **React** com **TypeScript** – estrutura e lógica da aplicação
- **Tailwind CSS** – estilização e responsividade
- **Firebase** – autenticação e banco de dados
- **Bibliotecas e ferramentas adicionais**:
  - `react-router-dom` – gerenciamento de rotas
  - `react-icons` – ícones personalizados
  - `react-hot-toast` – mensagens *toast* personalizadas
  - `zod` – validação de formulários (*schema validation*)
- **Hooks do React**:
  - `useState`
  - `useEffect`
  - `useContext`

## 📸 Preview

![preview](link-da-imagem-ou-gif-aqui)

## 📦 Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/webcarros.git
````

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o arquivo `.env` com suas credenciais do Firebase:**

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. **Inicie o servidor:**

   ```bash
   npm run dev
   ```

## 🤝 Contribuições

Contribuições são bem-vindas!
Abra uma *issue* ou envie um *pull request* para sugerir melhorias.

---

Feito com 💻 e ☕ por Mateua Demartino Bastos
