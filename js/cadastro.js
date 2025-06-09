const cadastroForm = document.getElementById('cadastro-form');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (!nome || !email || !senha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, email, senha }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(`Erro: ${data.error}`);
          return;
        }

        alert('Cadastro realizado com sucesso! Você pode agora fazer login.');
        window.location.href = 'index.html';
      })
      .catch(error => {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao cadastrar usuário. Tente novamente mais tarde.');
      });

  });
}