# 🌿 Trocaliza

**Rede comunitária para trocas e doações sustentáveis**

Trocaliza é uma plataforma web desenvolvida para promover a economia circular e a solidariedade através de trocas e doações de itens entre membros da comunidade. O projeto incentiva a sustentabilidade, reduz o desperdício e fortalece os laços comunitários.

![License](https://img.shields.io/badge/license-MIT-green)
![Angular](https://img.shields.io/badge/Angular-20-red)
![.NET](https://img.shields.io/badge/.NET-9.0-purple)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

A Trocaliza nasceu com o objetivo de criar uma plataforma digital que facilite trocas e doações de itens entre pessoas da mesma comunidade. Através de uma interface intuitiva e moderna, usuários podem:

- Publicar itens que desejam doar ou trocar
- Navegar por categorias de produtos
- Comentar em publicações de interesse
- Gerenciar suas próprias postagens
- Conectar-se com outros membros da comunidade

O projeto promove:
- ♻️ **Sustentabilidade** - Reutilização de objetos
- 🤝 **Solidariedade** - Ajuda mútua entre vizinhos
- 🌍 **Economia Circular** - Redução do consumo
- 👥 **Comunidade** - Fortalecimento de laços locais

---

## ✨ Funcionalidades

### Autenticação e Usuários
- ✅ Cadastro de novos usuários
- ✅ Login com JWT
- ✅ Gerenciamento de perfil
- ✅ Atualização de dados pessoais

### Publicações
- ✅ Criar publicações de itens
- ✅ Upload de imagens (até 5MB)
- ✅ Categorização de itens (Móveis, Eletrônicos, Vestuário, Livros, Outros)
- ✅ Editar e excluir próprias publicações
- ✅ Visualizar publicações da comunidade
- ✅ Filtrar por categorias

### Interações
- ✅ Comentar em publicações
- ✅ Visualizar detalhes completos de itens
- ✅ Sistema de notificações

### Interface
- ✅ Design responsivo (mobile-first)
- ✅ Tema claro e escuro
- ✅ Animações suaves
- ✅ Feedback visual em todas as ações

---

## 🛠️ Tecnologias

### Frontend
- **[Angular 20](https://angular.io/)** - Framework principal
- **[Angular Material](https://material.angular.io/)** - Componentes UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem
- **[RxJS](https://rxjs.dev/)** - Programação reativa

### Backend
- **[.NET 9.0](https://dotnet.microsoft.com/)** - Framework backend
- **[ASP.NET Core](https://docs.microsoft.com/aspnet/core)** - Web API
- **[Entity Framework Core](https://docs.microsoft.com/ef/core/)** - ORM
- **[SQLite](https://www.sqlite.org/)** - Banco de dados
- **[JWT](https://jwt.io/)** - Autenticação
- **[BCrypt.Net](https://github.com/BcryptNet/bcrypt.net)** - Hash de senhas

### Ferramentas
- **[Git](https://git-scm.com/)** - Controle de versão
- **[VS Code](https://code.visualstudio.com/)** - Editor de código
- **[Postman](https://www.postman.com/)** - Testes de API

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior)
- **npm** (v9 ou superior)
- **.NET SDK 8.0** ou superior
- **Git**

Verifique as versões:

```
node --version
npm --version
dotnet --version
git --version
```

---

## 🚀 Instalação

### 1. Clone o Repositório

```
git clone https://github.com/seu-usuario/trocaliza.git
cd trocaliza
```

### 2. Configure o Backend

```
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

O backend estará rodando em: `http://localhost:5000`

### 3. Configure o Frontend

```
cd frontend
npm install
ng serve
```

O frontend estará disponível em: `http://localhost:4200`

---

## ⚙️ Configuração

### Backend (appsettings.json)

```
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=trocaliza.db"
  },
  "JwtSettings": {
    "Secret": "sua-chave-secreta-super-segura-aqui",
    "Issuer": "TrocalizaAPI",
    "Audience": "TrocalizaClient",
    "ExpirationInMinutes": 1440
  },
  "FileUpload": {
    "MaxFileSize": 5242880,
    "AllowedExtensions": [".jpg", ".jpeg", ".png", ".gif"],
    "UploadPath": "uploads"
  }
}
```

### Frontend (environment.ts)

```
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

---

## 💻 Uso

### Criar uma Conta

1. Acesse a aplicação em `http://localhost:4200`
2. Clique em "Criar uma conta"
3. Preencha seus dados (nome, email e senha)
4. Faça login com suas credenciais

### Publicar um Item

1. Faça login na plataforma
2. Navegue até "Minhas Publicações"
3. Clique em "Nova Publicação"
4. Preencha:
   - Título do item
   - Descrição detalhada
   - Categoria
   - Imagem (opcional)
5. Clique em "Publicar"

### Explorar Itens

1. Acesse "Explorar"
2. Use os filtros por categoria
3. Clique em um item para ver detalhes
4. Deixe um comentário para entrar em contato

---

## 📁 Estrutura do Projeto

```
trocaliza/
├── backend/
│   ├── Controllers/          # Controladores da API
│   ├── Data/                 # Context e configurações do banco
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Models/               # Modelos de entidade
│   ├── Services/             # Serviços (Auth, File, Token)
│   ├── Program.cs            # Configuração principal
│   └── appsettings.json      # Configurações da aplicação
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes reutilizáveis
│   │   │   ├── layouts/      # Layouts (Navbar, Main)
│   │   │   ├── models/       # Interfaces TypeScript
│   │   │   ├── pages/        # Páginas da aplicação
│   │   │   ├── services/     # Serviços Angular
│   │   │   └── guards/       # Guards de rota
│   │   ├── assets/           # Imagens e recursos
│   │   └── styles.css        # Estilos globais
│   ├── tailwind.config.js    # Configuração Tailwind
│   └── angular.json          # Configuração Angular
│
└── README.md
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

**Thiago Luciano** - [GitHub](https://github.com/tlsilva89)

---

## 🙏 Agradecimentos

- Comunidade Angular
- Comunidade .NET
- Tailwind CSS
- Angular Material
- Todos os contribuidores

---
