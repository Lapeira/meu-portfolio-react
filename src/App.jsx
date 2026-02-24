import { useState, useEffect } from 'react';
import './App.css';

// 1. O COMPONENTE DO CARTÃO (Intacto)
function CartaoProjeto(props) {
  const [likes, setLikes] = useState(0);
  return (
    <div style={{ border: '2px solid #3498db', padding: '15px', margin: '10px 0', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{props.titulo}</h3>
      <p style={{ margin: '0 0 15px 0', color: '#555' }}>Tecnologia: <strong>{props.tecnologia}</strong></p>
      <button 
        onClick={() => setLikes(likes + 1)} 
        style={{ cursor: 'pointer', padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        ❤️ Gostos: {likes}
      </button>
    </div>
  );
}

// 2. A APP PRINCIPAL
function App() {
  const [listaDeProjetos, setListaDeProjetos] = useState([]);
  const [erro, setErro] = useState(false);

  // 3. NOVAS MEMÓRIAS PARA O FORMULÁRIO
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaTech, setNovaTech] = useState('');

  // 4. CARREGAR OS DADOS INICIAIS (GET)
  useEffect(() => {
    fetch('http://127.0.0.1:4000/api/projetos')
      .then(resposta => resposta.json())
      .then(dados => setListaDeProjetos(dados))
      .catch(() => setErro(true));
  }, []);

  // 5. A FUNÇÃO DE SUBMISSÃO (POST)
  async function lidarComSubmissao(evento) {
    evento.preventDefault(); // Impede o refresh da página!

    const novoProjeto = {
      titulo: novoTitulo,
      tecnologia: novaTech,
      concluido: false
    };

    try {
      const resposta = await fetch('http://127.0.0.1:4000/api/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProjeto)
      });

      if (resposta.ok) {
        const projetoCriado = await resposta.json();
        
        // A MAGIA DO REACT: 
        // Pegamos na lista atual (...listaDeProjetos) e adicionamos o novo no fim.
        // O React deteta a mudança e desenha o novo cartão instantaneamente!
        setListaDeProjetos([...listaDeProjetos, projetoCriado]);
        
        // Limpamos as caixas de texto
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
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>O Meu Portfólio Full-Stack ⚛️🚀</h1>
      
      {/* 6. A INTERFACE DO FORMULÁRIO */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px dashed #ccc', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>➕ Adicionar Novo Projeto</h3>
        
        <form onSubmit={lidarComSubmissao}>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Título:</strong></label><br />
            {/* Ligamos o "value" à memória e o "onChange" atualiza a memória */}
            <input 
              type="text" 
              required 
              value={novoTitulo} 
              onChange={(e) => setNovoTitulo(e.target.value)} 
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Tecnologia:</strong></label><br />
            <input 
              type="text" 
              required 
              value={novaTech} 
              onChange={(e) => setNovaTech(e.target.value)} 
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
            />
          </div>
          
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Guardar na Base de Dados
          </button>
        </form>
      </div>

      {erro && <p style={{ color: 'red' }}>Erro ao carregar os dados.</p>}

      {/* 7. DESENHAR A LISTA (Agora atualiza em tempo real!) */}
      {!erro && listaDeProjetos.map(projeto => (
        <CartaoProjeto 
          key={projeto.id}          
          titulo={projeto.titulo}         
          tecnologia={projeto.tecnologia} 
        />
      ))}
    </div>
  );
}

export default App;