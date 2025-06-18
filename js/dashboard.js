const imgbbAPIKey = '9a38d36d162032e65231552d4af958fe'; // Substitua pela sua chave real

const fileInput = document.getElementById('img');
const hiddenInputUrl = document.getElementById('img-url');
const listaDeRefeicoes = document.getElementById('lista-de-refeicoes');
const refeicaoForm = document.getElementById('refeicao-form');
const logoutBtn = document.getElementById('logout-btn');

let refeicoes = [];
let idEditando = null;
/*
const token = sessionStorage.getItem('token');
if (!token) {
  alert('Você precisa estar logado.');
  window.location.href = 'index.html';
}*/
const id_usuario = localStorage.getItem('id_usuario');
if (!id_usuario) {
  alert('Você precisa estar logado.');
  window.location.href = 'index.html';
}

// Formata data no formato dd/mm/yyyy
function formatarData(dataISO) {
  const data = new Date(dataISO);
  const dia = String(data.getUTCDate()).padStart(2, '0');
  const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
  const ano = data.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
}



// Carregar pratos do usuário logado
async function carregarRefeicoes() {
  try {
    const response = await fetch('http://localhost:3000/pratos');
    const data = await response.json();
    refeicoes = data;
    renderRefeicoes();
  } catch (error) {
    console.error('Erro ao carregar pratos:', error);
    alert('Erro ao carregar cardápio.');
  }
}

// Renderiza lista de pratos na tela
function renderRefeicoes() {
  listaDeRefeicoes.innerHTML = '';
  refeicoes.forEach(prato => {
    const div = document.createElement('div');
    div.classList.add('cardapio-item');
    div.innerHTML = `
      <div>
        <h3>${formatarData(prato.dia)}</h3>
        <p><strong>Turno:</strong> ${prato.turno}</p>
        <p><strong>Principal:</strong> ${prato.principal}</p>
        <p><strong>Sobremesa:</strong> ${prato.sobremesa}</p>
        <p><strong>Bebida:</strong> ${prato.bebida}</p>
        ${prato.imagem ? `<img src="${prato.imagem}" alt="Imagem do prato" />` : ''}
      </div>
      <div>
        <button onclick="editarRefeicao(event, ${prato.id_prato})">Alterar</button>
        <button onclick="excluirRefeicao(${prato.id_prato})">Excluir</button>
      </div>
    `;
    listaDeRefeicoes.appendChild(div);
  });
}

// Preenche formulário para edição de prato
function editarRefeicao(event, id) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const prato = refeicoes.find(p => p.id_prato === id);
  if (!prato) return alert('Refeição não encontrada!');

  document.querySelector('#form-refeicao h2').textContent = 'Editar Refeição';

  // Mostra o campo de ID
  document.getElementById('campo-id').style.display = "block";
  document.getElementById('id-refeicao-editando').value = prato.id_prato;

  document.getElementById('dia').value = prato.dia.slice(0, 10);
  document.getElementById('turno').value = prato.turno;
  document.getElementById('principal').value = prato.principal;
  document.getElementById('sobremesa').value = prato.sobremesa;
  document.getElementById('bebida').value = prato.bebida;
  document.getElementById('img-url').value = prato.imagem || '';

  idEditando = id;
}


// Criar ou atualizar prato
refeicaoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('id-refeicao-editando').value || null;
  const dia = document.getElementById('dia').value; // Data do input
  const turno = document.getElementById('turno').value;
  const principal = document.getElementById('principal').value;
  const sobremesa = document.getElementById('sobremesa').value;
  const bebida = document.getElementById('bebida').value;
  const imagem = document.getElementById('img-url').value;

  const id_usuario = localStorage.getItem('id_usuario');
  if (!id_usuario) {
    alert('Usuário não autenticado. Faça login antes.');
    return;
  }

  // Converter a data para o formato ISO (caso não esteja nesse formato)
  const dataFormatada = new Date(dia).toISOString(); 

  // Montar o objeto 'prato'
  let prato = { 
    dia: dataFormatada,
    turno,
    principal,
    sobremesa,
    bebida,
    imagem,
    id_usuario: Number(id_usuario)
  };

  // Adicionar o id_prato caso seja uma atualização (PUT)
  if (id && !isNaN(id)) {
    prato = { id_prato: Number(id), ...prato }; // Só inclui o id_prato se for um número válido
  }

  try {
    // Determina a URL e o método (POST ou PUT)
    const url = id ? `http://localhost:3000/pratos/${id}` : 'http://localhost:3000/pratos';
    const method = id ? 'PUT' : 'POST';

    // Exibe o método e URL no console
    console.log(`Método: ${method}`);
    console.log(`URL: ${url}`);
    console.log('Dados do prato:', prato);

    // Faz a requisição
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prato)
    });

    if (!response.ok) throw new Error('Erro na requisição');

    refeicaoForm.reset();
    document.getElementById('id-refeicao-editando').value = '';
    document.querySelector('#form-refeicao h2').textContent = 'Nova Refeição';

    await carregarRefeicoes();
    alert('Prato salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar prato:', error);
    alert('Erro ao salvar prato.');
  }
});


// Excluir prato
async function excluirRefeicao(id) {
  if (!confirm('Tem certeza que deseja excluir este prato?')) return;

  try {
    const response = await fetch(`http://localhost:3000/pratos/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Erro ao excluir prato');

    await carregarRefeicoes();
    alert('Prato excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir prato:', error);
    alert('Erro ao excluir prato.');
  }
}

// Upload de imagem para ImgBB
fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();

    if (result.success) {
      hiddenInputUrl.value = result.data.url;
      alert('Imagem enviada com sucesso!');
    } else {
      alert('Erro ao enviar imagem.');
    }
  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    alert('Erro ao conectar com o serviço de imagem.');
  }
});

// Logout
logoutBtn?.addEventListener('click', () => {
  //sessionStorage.removeItem('token');
  localStorage.removeItem('id_usuario');
  localStorage.removeItem('nome_usuario');
  localStorage.removeItem('email_usuario');
  window.location.href = 'index.html';
});

// Inicializa carregando os pratos
carregarRefeicoes();