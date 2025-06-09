const cadastroForm = document.getElementById('cadastro-form');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome  = document.getElementById('nome').value;
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

    const novoUsuario = { nome, email, senha };
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));

    alert('Cadastro realizado com sucesso! Você pode agora fazer login.');
    window.location.href = 'index.html';
  });
}