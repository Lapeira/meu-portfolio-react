import { useState, useEffect } from 'react';
import './App.css';

// 1. O COMPONENTE DO CARTÃO (Agora com botão de Apagar!)
function CartaoProjeto(props) {
  const [likes, setLikes] = useState(0);
  
  return (
    <div className="bg-white border border-gray-200 p-6 mb-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
      
      {/* BOTÃO DE APAGAR NO CANTO SUPERIOR DIREITO */}
      <button 
        onClick={() => props.funcaoApagar(props.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        title="Apagar Projeto"
      >
        🗑️
      </button>

      <h3 className="text-xl font-bold text-gray-800 mb-2 mr-8">{props.titulo}</h3>
      <p className="text-gray-600 mb-4">Tecnologia: <strong className="text-blue-600">{props.tecnologia}</strong></p>
      
      <button 
        onClick={() => setLikes(likes + 1)} 
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <span>❤️ Gostos:</span> 
        <span className="bg-white text-red-500 px-2 py-1 rounded-md text-sm">{likes}</span>
      </button>
    </div>
  );
}

// 2. A APP PRINCIPAL
function App() {
  const [listaDeProjetos, setListaDeProjetos] = useState([]);
  const [erro, setErro] = useState(false);
  const [erroAuth, setErroAuth] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaTech, setNovaTech] = useState('');

  // LER PROJETOS (GET)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/projetos`)
      .then(resposta => resposta.json())
      .then(dados => setListaDeProjetos(dados))
      .catch(() => setErro(true));
  }, []);

  // CRIAR PROJETO (POST)
  async function lidarComSubmissao(evento) {
    evento.preventDefault();
    const novoProjeto = { titulo: novoTitulo, tecnologia: novaTech, concluido: false };

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/projetos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': import.meta.env.VITE_CHAVE_SECRETA
        },
        body: JSON.stringify(novoProjeto)
      });

      if (resposta.ok) {
        const projetoCriado = await resposta.json();
        setListaDeProjetos([...listaDeProjetos, projetoCriado]);
        setNovoTitulo('');
        setNovaTech('');
        setErroAuth(false);
      } else if (resposta.status === 401) {
        setErroAuth(true);
      } else {
        alert("Erro ao guardar na Base de Dados.");
      }
    } catch (erro) {
      alert("O servidor backend não está a responder!");
    }
  }

  // === NOVA FUNÇÃO: APAGAR PROJETO (DELETE) ===
  async function apagarProjeto(idDoProjeto) {
    // Pede confirmação antes de apagar (Boa prática de segurança!)
    if (!window.confirm("Tens a certeza que queres apagar este projeto?")) {
      return; 
    }

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/projetos/${idDoProjeto}`, {
        method: 'DELETE',
        headers: {
          // Precisamos do bilhete VIP para apagar também!
          'Authorization': import.meta.env.VITE_CHAVE_SECRETA
        }
      });

      if (resposta.ok) {
        // Se o backend apagou com sucesso, removemos o cartão do ecrã instantaneamente
        // O "filter" cria uma lista nova com todos os projetos, EXCETO o que acabámos de apagar
        setListaDeProjetos(listaDeProjetos.filter(projeto => projeto.id !== idDoProjeto));
        setErroAuth(false);
      } else if (resposta.status === 401) {
        setErroAuth(true);
      }
    } catch (erro) {
      alert("Erro de conexão ao tentar apagar o projeto.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto">
        
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-2">
          O Meu Portfólio Full-Stack ⚛️
        </h1>
        <p className="text-center text-gray-500 mb-10">Construído com React, Node.js e Tailwind CSS</p>
        
        {/* FORMULÁRIO */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-10">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>➕</span> Adicionar Novo Projeto (Apenas Admin)
          </h3>
          <form onSubmit={lidarComSubmissao} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Projeto</label>
              <input type="text" required value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Ex: App de Gestão"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tecnologia</label>
              <input type="text" required value={novaTech} onChange={(e) => setNovaTech(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Ex: React, Node, PostgreSQL"/>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-2">Guardar de Forma Segura 🔒</button>
          </form>
        </div>

        {/* MENSAGENS DE ERRO */}
        {erro && (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm"><p className="font-bold">Erro de Conexão</p><p>O servidor Backend não está a correr.</p></div>)}
        {erroAuth && (<div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md mb-6 shadow-sm"><p className="font-bold">Acesso Bloqueado pelo Segurança 🛑</p><p>Não tens permissão. A Chave Secreta está incorreta.</p></div>)}

        {/* LISTA DE PROJETOS */}
        <div className="space-y-4">
          {!erro && listaDeProjetos.map(projeto => (
            <CartaoProjeto 
              key={projeto.id}
              id={projeto.id} // Passamos o ID para o cartão saber quem ele é
              titulo={projeto.titulo}         
              tecnologia={projeto.tecnologia}
              funcaoApagar={apagarProjeto} // Passamos a função de apagar como propriedade!
            />
          ))}
          {listaDeProjetos.length === 0 && !erro && (<div className="text-center p-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">A carregar projetos ou base de dados vazia...</div>)}
        </div>

      </div>
    </div>
  );
}

export default App;