const imgbbAPIKey = 'SUA_API_KEY_DO_IMGBB'; // Substitua por sua chave real

const fileInput = document.getElementById('img');
const hiddenInputUrl = document.getElementById('img-url');
const turno = document.getElementById('turno').value;

const listaDeRefeicoes = document.getElementById('lista-de-refeicoes');
const refeicaoForm = document.getElementById('refeicao-form');



let refeicoes = [];
let idEditando = null;

// Carregar refeições da API
async function carregarRefeicoes() {
  try {
    const response = await fetch('https://seu-backend.com/api/refeicoes');
    const data = await response.json();
    refeicoes = data;
    renderRefeicoes();
  } catch (error) {
    console.error('Erro ao carregar refeições:', error);
    alert('Erro ao carregar cardápio.');
  }
}

// Renderizar refeições na tela
function renderRefeicoes() {
  listaDeRefeicoes.innerHTML = '';
  refeicoes.forEach(refeicao => {
    const div = document.createElement('div');
    div.classList.add('cardapio-item');
    div.innerHTML = `
      <div>
        <h3>${refeicao.dia}</h3>
        <p><strong>Turno:</strong> ${refeicao.turno}</p>
        <p>${refeicao.cardapio}</p>
        <img src="${refeicao.img}" alt="${refeicao.alt}" />
      </div>
      <div>
        <button onclick="editarRefeicao(${refeicao.id})">Alterar</button>
        <button onclick="excluirRefeicao(${refeicao.id})">Excluir</button>
      </div>
    `;
    listaDeRefeicoes.appendChild(div);
  });
}

// Editar refeição
function editarRefeicao(id) {
  const refeicao = refeicoes.find(r => r.id === id);
  document.getElementById('dia').value = refeicao.dia;
  document.getElementById('turno').value = refeicao.turno;
  document.getElementById('cardapio').value = refeicao.cardapio;
  document.getElementById('img-url').value = refeicao.img;
  document.getElementById('alt').value = refeicao.alt;
  idEditando = id;
}

// Salvar ou atualizar refeição
refeicaoForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const dia = document.getElementById('dia').value;
  const turno=document.getElementById('turno').value;
  const cardapio = document.getElementById('cardapio').value;
  const img = document.getElementById('img-url').value;
  const alt = document.getElementById('alt').value;

  const refeicao = { dia, turno, cardapio, img, alt };

  try {
    if (idEditando !== null) {
      await fetch(`https://seu-backend.com/api/refeicoes/${idEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refeicao)
      });
    } else {
      await fetch('https://seu-backend.com/api/refeicoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refeicao)
      });
    }

    refeicaoForm.reset();
    idEditando = null;
    await carregarRefeicoes();

  } catch (error) {
    console.error('Erro ao salvar refeição:', error);
    alert('Erro ao salvar refeição.');
  }
});

// Excluir refeição
async function excluirRefeicao(id) {
  try {
    await fetch(`https://seu-backend.com/api/refeicoes/${id}`, {
      method: 'DELETE'
    });
    await carregarRefeicoes();
  } catch (error) {
    console.error('Erro ao excluir refeição:', error);
    alert('Erro ao excluir refeição.');
  }
}

// Upload de imagem com ImgBB
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
      alert('Erro ao enviar imagem. Verifique o arquivo e tente novamente.');
    }
  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    alert('Falha na conexão com o serviço de imagem.');
  }
});

// Inicializar
carregarRefeicoes();

