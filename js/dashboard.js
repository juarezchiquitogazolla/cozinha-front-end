const imgbbAPIKey = 'SUA_API_KEY_DO_IMGBB'; // Substitua por sua chave real

const fileInput = document.getElementById('img');
const hiddenInputUrl = document.getElementById('img-url');
const listaDeRefeicoes = document.getElementById('lista-de-refeicoes');
const refeicaoForm = document.getElementById('refeicao-form');
const logoutBtn = document.getElementById('logout-btn');

let refeicoes = [];
let idEditando = null;

const token = sessionStorage.getItem('token');
if (!token) {
  alert('Você precisa estar logado.');
  window.location.href = 'index.html';
}

// Carregar pratos da cozinheira logada
async function carregarRefeicoes() {
  try {
    const response = await fetch('http://localhost:3000/pratos', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    refeicoes = data;
    renderRefeicoes();
  } catch (error) {
    console.error('Erro ao carregar pratos:', error);
    alert('Erro ao carregar cardápio.');
  }
}

// Renderizar os pratos
function renderRefeicoes() {
  listaDeRefeicoes.innerHTML = '';
  refeicoes.forEach(prato => {
    const div = document.createElement('div');
    div.classList.add('cardapio-item');
    div.innerHTML = `
      <div>
        <h3>${new Date(prato.dia).toLocaleDateString()}</h3>
        <p><strong>Turno:</strong> ${prato.turno}</p>
        <p><strong>Principal:</strong> ${prato.principal}</p>
        <p><strong>Sobremesa:</strong> ${prato.sobremesa}</p>
        <p><strong>Bebida:</strong> ${prato.bebida}</p>
        ${prato.imagem ? `<img src="${prato.imagem}" alt="Imagem do prato" />` : ''}
      </div>
      <div>
        <button onclick="editarRefeicao(${prato.id_prato})">Alterar</button>
        <button onclick="excluirRefeicao(${prato.id_prato})">Excluir</button>
      </div>
    `;
    listaDeRefeicoes.appendChild(div);
  });
}

// Preencher o formulário para edição
function editarRefeicao(id) {
  const prato = refeicoes.find(p => p.id_prato === id);
  document.getElementById('dia').value = prato.dia.slice(0, 10);
  document.getElementById('turno').value = prato.turno;
  document.getElementById('principal').value = prato.principal;
  document.getElementById('sobremesa').value = prato.sobremesa;
  document.getElementById('bebida').value = prato.bebida;
  document.getElementById('img-url').value = prato.imagem || '';
  idEditando = id;
}

// Criar ou atualizar prato
refeicaoForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const dia = document.getElementById('dia').value;
  const turno = document.getElementById('turno').value;
  const principal = document.getElementById('principal').value;
  const sobremesa = document.getElementById('sobremesa').value;
  const bebida = document.getElementById('bebida').value;
  const imagem = document.getElementById('img-url').value;

  const prato = { dia, turno, principal, sobremesa, bebida, imagem };

  try {
    const url = idEditando
      ? `http://localhost:3000/pratos/${idEditando}`
      : 'http://localhost:3000/pratos';

    const method = idEditando ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(prato)
    });

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    refeicaoForm.reset();
    idEditando = null;
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
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir prato');
    }

    await carregarRefeicoes();
    alert('Prato excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir prato:', error);
    alert('Erro ao excluir prato.');
  }
}

// Upload de imagem para ImgBB
fileInput.addEventListener('change', async function () {
  const file = this.files[0];
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

// 🚪 Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
  });
}

// Inicializar
carregarRefeicoes();