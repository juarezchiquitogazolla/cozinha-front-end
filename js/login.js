const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));
    console.log(usuarioSalvo);

    if (!usuarioSalvo || usuarioSalvo.email !== email || usuarioSalvo.senha !== senha) {
      if (!usuarioSalvo) {
        alert('Usuário não encontrado. Redirecionando para o cadastro...');
        window.location.href = 'cadastro.html';
      } else {
        alert('Senha incorreta!');
      }
      return;
    }

    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioSalvo));
    window.location.href = 'dashboard.html';
  });
}
