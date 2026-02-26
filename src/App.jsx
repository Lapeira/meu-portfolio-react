import { useState, useEffect } from 'react';
import './App.css';

// 1. O COMPONENTE DO CARTÃO (Agora com Tailwind!)
function CartaoProjeto(props) {
  const [likes, setLikes] = useState(0);
  
  return (
    // Olha para estas classes: sombra (shadow), cantos arredondados (rounded-xl), e animação suave (transition)
    <div className="bg-white border border-gray-200 p-6 mb-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{props.titulo}</h3>
      <p className="text-gray-600 mb-4">Tecnologia: <strong className="text-blue-600">{props.tecnologia}</strong></p>
      
      {/* O botão agora tem hover:bg-red-600 (muda de cor ao passar o rato!) */}
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
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaTech, setNovaTech] = useState('');

  // Vai buscar os dados
  useEffect(() => {
    fetch('http://127.0.0.1:4000/api/projetos')
      .then(resposta => resposta.json())
      .then(dados => setListaDeProjetos(dados))
      .catch(() => setErro(true));
  }, []);

  // Envia os dados
  async function lidarComSubmissao(evento) {
    evento.preventDefault();
    const novoProjeto = { titulo: novoTitulo, tecnologia: novaTech, concluido: false };

    try {
      const resposta = await fetch('http://127.0.0.1:4000/api/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProjeto)
      });

      if (resposta.ok) {
        const projetoCriado = await resposta.json();
        setListaDeProjetos([...listaDeProjetos, projetoCriado]);
        setNovoTitulo('');
        setNovaTech('');
      } else {
        alert("Erro ao guardar na Base de Dados.");
      }
    } catch (erro) {
      alert("O servidor na porta 4000 não está a responder!");
    }
  }

  return (
    // max-w-2xl limita a largura, mx-auto centra no ecrã, bg-gray-50 dá um fundo cinza muito clarinho à página toda
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto">
        
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-2">
          O Meu Portfólio Full-Stack ⚛️
        </h1>
        <p className="text-center text-gray-500 mb-10">Construído com React, Node.js e Tailwind CSS</p>
        
        {/* 6. A INTERFACE DO FORMULÁRIO */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-10">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>➕</span> Adicionar Novo Projeto
          </h3>
          
          <form onSubmit={lidarComSubmissao} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Projeto</label>
              {/* focus:ring-2 cria um anel azul à volta da caixa quando clicas nela! */}
              <input 
                type="text" required value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: App de Gestão"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tecnologia</label>
              <input 
                type="text" required value={novaTech} onChange={(e) => setNovaTech(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: React, Node, SQLite"
              />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-2">
              Guardar na Base de Dados
            </button>
          </form>
        </div>

        {/* Mensagens de estado */}
        {erro && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
            <p className="font-bold">Erro de Conexão</p>
            <p>O servidor Backend (porta 4000) não está a correr.</p>
          </div>
        )}

        {/* 7. DESENHAR A LISTA DE PROJETOS */}
        <div className="space-y-4">
          {!erro && listaDeProjetos.map(projeto => (
            <CartaoProjeto 
              key={projeto.id}          
              titulo={projeto.titulo}         
              tecnologia={projeto.tecnologia} 
            />
          ))}
          
          {listaDeProjetos.length === 0 && !erro && (
            <div className="text-center p-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              A carregar projetos ou base de dados vazia...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;