# 📚 Sistema de Cadastro de Alunos

Um sistema web completo para cadastro e gerenciamento de alunos, desenvolvido com HTML, CSS e JavaScript puro.

## 🎯 Sobre o Projeto

Este sistema permite o cadastro, visualização, edição e exclusão de informações de alunos de forma simples e intuitiva. Todos os dados são armazenados localmente no navegador usando LocalStorage.

## ✨ Funcionalidades

### 🏠 Tela Principal
- Menu principal com navegação simples
- Acesso rápido às funcionalidades principais
- Design moderno e responsivo

### ➕ Cadastro de Alunos
- **Nome**: Campo obrigatório (mínimo 2 caracteres)
- **Idade**: Validação entre 1 e 100 anos
- **Curso**: Seleção entre 8 opções disponíveis
- **Fase**: Seleção da 1ª à 10ª fase
- **Validações**: Impede cadastros duplicados e dados inválidos
- **Botões**:
  - 🗑️ **Limpar**: Limpa todos os campos
  - ✅ **Cadastrar**: Salva o novo aluno
  - ← **Voltar**: Retorna ao menu principal

### 📊 Gerenciamento de Alunos
- **Tabela Completa**: Visualização de todos os alunos cadastrados
- **Busca Inteligente**: Filtro por nome, curso ou fase
- **Ações por Aluno**:
  - ✏️ **Editar**: Abre modal para edição completa
  - 🗑️ **Excluir**: Confirmação antes da exclusão
- **Navegação**: Botão para voltar ao menu principal

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização e responsividade
- **JavaScript ES6+**: Lógica e interações
- **LocalStorage**: Persistência de dados
- **Design Responsivo**: Compatible com desktop e mobile

## 📁 Estrutura do Projeto

```
cadastro-de-alunos/
├── index.html              # Página principal
├── novo-aluno.html         # Formulário de cadastro
├── gerenciar-alunos.html   # Tabela e gerenciamento
├── styles.css              # Estilos globais
├── script.js               # Lógica JavaScript
└── README.md               # Documentação
```

## 🚀 Como Usar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado

### Instalação
1. Faça o download dos arquivos do projeto
2. Mantenha todos os arquivos na mesma pasta
3. Abra o arquivo `index.html` em seu navegador

### Uso Básico

#### 1. Cadastrando um Aluno
1. Na tela principal, clique em **"Novo Aluno"**
2. Preencha todos os campos obrigatórios
3. Clique em **"Cadastrar"**
4. Confirme a mensagem de sucesso

#### 2. Gerenciando Alunos
1. Na tela principal, clique em **"Gerenciar Alunos"**
2. Visualize todos os alunos na tabela
3. Use a busca para filtrar alunos específicos
4. Clique em **"Editar"** para modificar dados
5. Clique em **"Excluir"** para remover um aluno

#### 3. Editando um Aluno
1. Na tabela, clique no botão **"Editar"** do aluno desejado
2. Modifique os dados no modal que aparece
3. Clique em **"Salvar Alterações"**
4. Confirme a mensagem de sucesso

#### 4. Excluindo um Aluno
1. Na tabela, clique no botão **"Excluir"** do aluno desejado
2. Confirme a exclusão no modal de confirmação
3. O aluno será removido permanentemente
