// Sistema de Cadastro de Alunos
// Armazenamento local dos dados

class SistemaAlunos {
    constructor() {
        this.alunos = this.carregarAlunos();
        this.proximoId = this.obterProximoId();
        this.alunoParaExcluir = null;
        this.initEventListeners();
    }

    // Inicializar event listeners
    initEventListeners() {
        // Event listeners para modais
        this.configurarModais();
        
        // Event listener para formulário de cadastro
        const formAluno = document.getElementById('formAluno');
        if (formAluno) {
            formAluno.addEventListener('submit', (e) => this.cadastrarAluno(e));
        }

        // Event listener para formulário de edição
        const formEdicao = document.getElementById('formEdicao');
        if (formEdicao) {
            formEdicao.addEventListener('submit', (e) => this.salvarEdicao(e));
        }

        // Event listener para busca
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.buscarAluno();
                }
            });
        }

        // Carregar tabela na página de gerenciamento
        if (document.getElementById('tabelaAlunos')) {
            this.carregarTabela();
        }
    }

    // Configurar modais
    configurarModais() {
        // Modal principal
        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }

        // Modal de edição
        const modalEdicao = document.getElementById('modalEdicao');
        const closeEditBtn = document.querySelector('.close-edit');
        
        if (closeEditBtn) {
            closeEditBtn.onclick = () => {
                modalEdicao.style.display = 'none';
            };
        }

        // Fechar modal clicando fora
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
            if (event.target === modalEdicao) {
                modalEdicao.style.display = 'none';
            }
            const modalConfirmacao = document.getElementById('modalConfirmacao');
            if (event.target === modalConfirmacao) {
                modalConfirmacao.style.display = 'none';
            }
        };
    }

    // Carregar alunos do localStorage
    carregarAlunos() {
        const dados = localStorage.getItem('alunos');
        return dados ? JSON.parse(dados) : [];
    }

    // Salvar alunos no localStorage
    salvarAlunos() {
        localStorage.setItem('alunos', JSON.stringify(this.alunos));
    }

    // Obter próximo ID
    obterProximoId() {
        if (this.alunos.length === 0) return 1;
        return Math.max(...this.alunos.map(aluno => aluno.id)) + 1;
    }

    // Validar dados do aluno
    validarDados(nome, idade, curso, fase) {
        const erros = [];

        if (!nome || nome.trim().length < 2) {
            erros.push('Nome deve ter pelo menos 2 caracteres');
        }

        if (!idade || idade < 1 || idade > 100) {
            erros.push('Idade deve estar entre 1 e 100 anos');
        }

        if (!curso) {
            erros.push('Curso deve ser selecionado');
        }

        if (!fase) {
            erros.push('Fase deve ser selecionada');
        }

        // Verificar se já existe aluno com mesmo nome
        const nomeExiste = this.alunos.some(aluno => 
            aluno.nome.toLowerCase() === nome.toLowerCase()
        );

        if (nomeExiste) {
            erros.push('Já existe um aluno cadastrado com este nome');
        }

        return erros;
    }

    // Cadastrar novo aluno
    cadastrarAluno(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const idade = parseInt(document.getElementById('idade').value);
        const curso = document.getElementById('curso').value;
        const fase = document.getElementById('fase').value;

        const erros = this.validarDados(nome, idade, curso, fase);

        if (erros.length > 0) {
            this.mostrarModal('Erro no cadastro:\n' + erros.join('\n'));
            return;
        }

        const novoAluno = {
            id: this.proximoId++,
            nome: nome,
            idade: idade,
            curso: curso,
            fase: fase,
            dataCadastro: new Date().toISOString()
        };

        this.alunos.push(novoAluno);
        this.salvarAlunos();

        this.mostrarModal(`Aluno ${nome} cadastrado com sucesso!`);
        this.limparFormulario();
    }

    // Limpar formulário
    limparFormulario() {
        const form = document.getElementById('formAluno');
        if (form) {
            form.reset();
            // Focar no primeiro campo
            document.getElementById('nome').focus();
        }
    }

    // Carregar tabela de alunos
    carregarTabela(alunosFiltrados = null) {
        const tbody = document.getElementById('corpoTabela');
        const mensagemVazia = document.getElementById('mensagemVazia');
        const tabela = document.getElementById('tabelaAlunos');

        if (!tbody) return;

        const alunos = alunosFiltrados || this.alunos;

        if (alunos.length === 0) {
            tbody.innerHTML = '';
            tabela.style.display = 'none';
            mensagemVazia.style.display = 'block';
            return;
        }

        tabela.style.display = 'table';
        mensagemVazia.style.display = 'none';

        tbody.innerHTML = alunos.map(aluno => `
            <tr>
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.idade} anos</td>
                <td>${aluno.curso}</td>
                <td>${aluno.fase}</td>
                <td>
                    <button class="btn btn-edit" onclick="sistemaAlunos.editarAluno(${aluno.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-delete" onclick="sistemaAlunos.confirmarExclusao(${aluno.id})">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Buscar aluno
    buscarAluno() {
        const termo = document.getElementById('searchInput').value.toLowerCase().trim();
        
        if (!termo) {
            this.mostrarTodosAlunos();
            return;
        }

        const alunosFiltrados = this.alunos.filter(aluno =>
            aluno.nome.toLowerCase().includes(termo) ||
            aluno.curso.toLowerCase().includes(termo) ||
            aluno.fase.toLowerCase().includes(termo)
        );

        this.carregarTabela(alunosFiltrados);

        if (alunosFiltrados.length === 0) {
            this.mostrarModal(`Nenhum aluno encontrado para "${termo}"`);
        }
    }

    // Mostrar todos os alunos
    mostrarTodosAlunos() {
        document.getElementById('searchInput').value = '';
        this.carregarTabela();
    }

    // Confirmar exclusão
    confirmarExclusao(id) {
        const aluno = this.alunos.find(a => a.id === id);
        if (!aluno) return;

        this.alunoParaExcluir = id;
        const modal = document.getElementById('modalConfirmacao');
        const mensagem = document.getElementById('mensagemConfirmacao');
        
        mensagem.textContent = `Tem certeza que deseja excluir o aluno "${aluno.nome}"?`;
        modal.style.display = 'block';
    }

    // Executar exclusão
    executarExclusao() {
        if (this.alunoParaExcluir) {
            const aluno = this.alunos.find(a => a.id === this.alunoParaExcluir);
            const nome = aluno ? aluno.nome : 'Aluno';
            
            this.alunos = this.alunos.filter(a => a.id !== this.alunoParaExcluir);
            this.salvarAlunos();
            this.carregarTabela();
            
            this.fecharModalConfirmacao();
            this.mostrarModal(`Aluno "${nome}" excluído com sucesso!`);
            
            this.alunoParaExcluir = null;
        }
    }

    // Fechar modal de confirmação
    fecharModalConfirmacao() {
        document.getElementById('modalConfirmacao').style.display = 'none';
        this.alunoParaExcluir = null;
    }

    // Editar aluno
    editarAluno(id) {
        const aluno = this.alunos.find(a => a.id === id);
        if (!aluno) return;

        document.getElementById('editId').value = aluno.id;
        document.getElementById('editNome').value = aluno.nome;
        document.getElementById('editIdade').value = aluno.idade;
        document.getElementById('editCurso').value = aluno.curso;
        document.getElementById('editFase').value = aluno.fase;

        document.getElementById('modalEdicao').style.display = 'block';
    }

    // Salvar edição
    salvarEdicao(e) {
        e.preventDefault();

        const id = parseInt(document.getElementById('editId').value);
        const nome = document.getElementById('editNome').value.trim();
        const idade = parseInt(document.getElementById('editIdade').value);
        const curso = document.getElementById('editCurso').value;
        const fase = document.getElementById('editFase').value;

        // Validar dados (exceto verificação de nome duplicado para o mesmo aluno)
        const erros = [];

        if (!nome || nome.trim().length < 2) {
            erros.push('Nome deve ter pelo menos 2 caracteres');
        }

        if (!idade || idade < 1 || idade > 100) {
            erros.push('Idade deve estar entre 1 e 100 anos');
        }

        if (!curso) {
            erros.push('Curso deve ser selecionado');
        }

        if (!fase) {
            erros.push('Fase deve ser selecionada');
        }

        // Verificar se já existe outro aluno com mesmo nome
        const nomeExiste = this.alunos.some(aluno => 
            aluno.nome.toLowerCase() === nome.toLowerCase() && aluno.id !== id
        );

        if (nomeExiste) {
            erros.push('Já existe outro aluno cadastrado com este nome');
        }

        if (erros.length > 0) {
            this.mostrarModal('Erro na edição:\n' + erros.join('\n'));
            return;
        }

        // Atualizar aluno
        const index = this.alunos.findIndex(a => a.id === id);
        if (index !== -1) {
            this.alunos[index] = {
                ...this.alunos[index],
                nome: nome,
                idade: idade,
                curso: curso,
                fase: fase,
                dataEdicao: new Date().toISOString()
            };

            this.salvarAlunos();
            this.carregarTabela();
            this.fecharModalEdicao();
            this.mostrarModal(`Dados do aluno "${nome}" atualizados com sucesso!`);
        }
    }

    // Fechar modal de edição
    fecharModalEdicao() {
        document.getElementById('modalEdicao').style.display = 'none';
    }

    // Mostrar modal
    mostrarModal(mensagem) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        
        if (modal && modalMessage) {
            modalMessage.textContent = mensagem;
            modal.style.display = 'block';
            
            // Auto-fechar após 3 segundos
            setTimeout(() => {
                modal.style.display = 'none';
            }, 3000);
        }
    }

    // Exportar dados (funcionalidade extra)
    exportarDados() {
        if (this.alunos.length === 0) {
            this.mostrarModal('Não há dados para exportar');
            return;
        }

        const dados = JSON.stringify(this.alunos, null, 2);
        const blob = new Blob([dados], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `alunos_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.mostrarModal('Dados exportados com sucesso!');
    }

    // Importar dados (funcionalidade extra)
    importarDados(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const dados = JSON.parse(e.target.result);
                if (Array.isArray(dados)) {
                    this.alunos = dados;
                    this.proximoId = this.obterProximoId();
                    this.salvarAlunos();
                    this.carregarTabela();
                    this.mostrarModal('Dados importados com sucesso!');
                } else {
                    this.mostrarModal('Formato de arquivo inválido');
                }
            } catch (error) {
                this.mostrarModal('Erro ao importar dados: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // Limpar todos os dados
    limparTodosDados() {
        if (confirm('Tem certeza que deseja excluir TODOS os dados? Esta ação não pode ser desfeita.')) {
            this.alunos = [];
            this.proximoId = 1;
            this.salvarAlunos();
            this.carregarTabela();
            this.mostrarModal('Todos os dados foram excluídos');
        }
    }

    // Estatísticas (funcionalidade extra)
    obterEstatisticas() {
        const stats = {
            total: this.alunos.length,
            cursos: {},
            fases: {},
            idadeMedia: 0
        };

        if (this.alunos.length > 0) {
            // Contar por curso
            this.alunos.forEach(aluno => {
                stats.cursos[aluno.curso] = (stats.cursos[aluno.curso] || 0) + 1;
                stats.fases[aluno.fase] = (stats.fases[aluno.fase] || 0) + 1;
            });

            // Calcular idade média
            const somaIdades = this.alunos.reduce((soma, aluno) => soma + aluno.idade, 0);
            stats.idadeMedia = (somaIdades / this.alunos.length).toFixed(1);
        }

        return stats;
    }
}

// Funções globais para serem chamadas pelos botões HTML
function limparFormulario() {
    sistemaAlunos.limparFormulario();
}

function buscarAluno() {
    sistemaAlunos.buscarAluno();
}

function mostrarTodosAlunos() {
    sistemaAlunos.mostrarTodosAlunos();
}

function fecharModalEdicao() {
    sistemaAlunos.fecharModalEdicao();
}

function fecharModalConfirmacao() {
    sistemaAlunos.fecharModalConfirmacao();
}

function confirmarExclusao() {
    sistemaAlunos.executarExclusao();
}

// Inicializar sistema quando a página carregar
let sistemaAlunos;

document.addEventListener('DOMContentLoaded', function() {
    sistemaAlunos = new SistemaAlunos();
    
    // Adicionar funcionalidades extras se necessário
    console.log('Sistema de Cadastro de Alunos carregado com sucesso!');
    
    // Se estivermos na página de gerenciamento, mostrar estatísticas no console
    if (document.getElementById('tabelaAlunos')) {
        const stats = sistemaAlunos.obterEstatisticas();
        console.log('Estatísticas:', stats);
    }
});
