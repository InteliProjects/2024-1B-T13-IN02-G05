if (window.location.pathname === '/') {
    const botaoLogar = document.getElementById("entrar-login");

    botaoLogar.addEventListener('click', async (event) => {
        // Tira o redirecionamento natural do botão
        event.preventDefault();

        const password = document.getElementById('password');
        const email = document.getElementById('email');
        const form = document.querySelector('#form');
        const formData = new FormData(form);
        const response = await fetch(form.action, { // Pega o action (tipo endpoint) que o form define
            method: 'POST',
            body: formData // O corpo da requisição são os dados do form
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error);
            password.style.borderColor = '#EB5757';
            email.style.borderColor = '#EB5757';
            return;
        }
        const data = await response.json(); // Pega a resposta da requisição e transforma em JSON
        if (data.message == "Login successful") {
            window.location.href = data.tela;
            password.style.borderColor = '#cccccc';
            email.style.borderColor = '#cccccc';
        } else {
            alert("Invalid Email or Password");
            password.style.borderColor = '#EB5757';
            email.style.borderColor = '#EB5757';
        }
    });

    const botaoMostrarSenha = document.getElementById("togglePassword");

    botaoMostrarSenha.addEventListener('click', function () {
        const password = document.getElementById('password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.src = type === 'password' ? '/icons/view-on.png' : '/icons/view-off.png';
    });
}
