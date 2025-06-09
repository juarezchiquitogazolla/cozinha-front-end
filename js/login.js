const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(`Erro: ${data.error}`);
          return;
        }

        // Armazena token e redireciona
        sessionStorage.setItem('token', data.token);
        alert('Login realizado com sucesso!');
        window.location.href = 'dashboard.html';
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Tente novamente mais tarde.');
      });
  });
}

