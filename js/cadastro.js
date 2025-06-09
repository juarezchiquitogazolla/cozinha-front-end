const cadastroForm = document.getElementById('cadastro-form');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const masp = document.getElementById('masp-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (!masp || !senha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const novoUsuario = { masp, senha };
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));

    alert('Cadastro realizado com sucesso! Você pode agora fazer login.');
    window.location.href = 'index.html';
  });
}