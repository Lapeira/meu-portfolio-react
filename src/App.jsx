import { useState, useEffect } from 'react';
import './App.css';

// 1. O COMPONENTE DO CARTÃO (Design Tailwind intacto)
function CartaoProjeto(props) {
  const [likes, setLikes] = useState(0);
  
  return (
    <div className="bg-white border border-gray-200 p-6 mb-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{props.titulo}</h3>
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
  const [erroAuth, setErroAuth] = useState(false); // Nova memória para apanhar hackers!
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaTech, setNovaTech] = useState('');

  // Vai buscar os dados (GET - Público: qualquer pessoa pode ver)
  useEffect(() => {
    // Usamos a variável de ambiente para saber onde está o Backend (Local ou Render)
    fetch(`${import.meta.env.VITE_API_URL}/api/projetos`)
      .then(resposta => resposta.json())
      .then(dados => setListaDeProjetos(dados))
      .catch(() => setErro(true));
  }, []);

  // Envia os dados (POST - Protegido: só tu podes criar)
  async function lidarComSubmissao(evento) {
    evento.preventDefault();
    const novoProjeto = { titulo: novoTitulo, tecnologia: novaTech, concluido: false };

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/api/projetos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // O BILHETE VIP: Passamos a password secreta configurada no .env / Vercel
          'Authorization': import.meta.env.VITE_CHAVE_SECRETA
        },
        body: JSON.stringify(novoProjeto)
      });

      // Se o backend aceitar o bilhete (Status 200/201)
      if (resposta.ok) {
        const projetoCriado = await resposta.json();
        setListaDeProjetos([...listaDeProjetos, projetoCriado]);
        setNovoTitulo('');
        setNovaTech('');
        setErroAuth(false); // Limpa o erro caso tenha havido um antes
      } 
      // Se o backend bloquear o segurança (Status 401 - Unauthorized)
      else if (resposta.status === 401) {
        setErroAuth(true);
      } 
      // Qualquer outro erro
      else {
        alert("Erro ao guardar na Base de Dados.");
      }
    } catch (erro) {
      alert("O servidor backend não está a responder!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto">
        
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-2">
          O Meu Portfólio Full-Stack ⚛️
        </h1>
        <p className="text-center text-gray-500 mb-10">Construído com React, Node.js e Tailwind CSS</p>
        
        {/* A INTERFACE DO FORMULÁRIO */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-10">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>➕</span> Adicionar Novo Projeto (Apenas Admin)
          </h3>
          
          <form onSubmit={lidarComSubmissao} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Projeto</label>
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
                placeholder="Ex: React, Node, PostgreSQL"
              />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-2">
              Guardar de Forma Segura 🔒
            </button>
          </form>
        </div>

        {/* Mensagens de estado */}
        {erro && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
            <p className="font-bold">Erro de Conexão</p>
            <p>O servidor Backend não está a correr ou o URL está incorreto.</p>
          </div>
        )}

        {/* Novo aviso se o Bilhete VIP falhar */}
        {erroAuth && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md mb-6 shadow-sm">
            <p className="font-bold">Acesso Bloqueado pelo Segurança 🛑</p>
            <p>Não tens permissão para adicionar projetos. A Chave Secreta está incorreta.</p>
          </div>
        )}

        {/* DESENHAR A LISTA DE PROJETOS */}
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