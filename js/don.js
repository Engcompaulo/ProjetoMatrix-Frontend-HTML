  // instacia o sistema cadastro
  var sistema = new SistemaCadastro();

  // esse objeto funciona como um dicionario, já que usamos o número 1 e 2 para representar as opções
  const SEXO = {
    '1': 'Masculino',
    '2': 'Feminino'
  };

  // essa função é chamada quando clicamos no link Editar. passamos o email do participante como argumento para essa função
  // ela pega os dados do participante, pega o elemento formulário e popula os campos do formulário
  function editar(email) {
    var participante = sistema.obterParticipante(email);
    var form = document.querySelector("#formulario");

    form.nome.value = participante.nome;
    form.sobrenome.value = participante.sobrenome;
    form.email.value = participante.email;
    form.idade.value = participante.idade;
    form.sexo.value = participante.sexo;
    form.nota.value = participante.nota;

    //não pode alterar email por ser utilizado como chave primária
    form.email.disabled = true;

    //para as funções que cuidam da manipulação dos dados no html saberem quando o formulário está em modo de edição ou criação
    form.atualizacao.value = true;
  }

  function excluir(email) {
    sistema.removerParticipante(email);
    //forçar a página ser recorregada depois da exclusão
    window.location.reload(true);
  }

  function carregarListaDeParticipantes() {
    //pegar o elemento html onde mostra a listagem dos participantes.
    var listaDeParticipantesHTML = document.querySelector('.list-group');

    var participantes = sistema.obterParticipantes();

    document.querySelector(".total_participantes").innerHTML = participantes.length;

    participantes.forEach(participante => {
      var htmlItem = templateItemHtml
        .replace("{{nome_participante}}", `${participante.nome} ${participante.sobrenome}`)
        .replace("{{info_participante}}", `${participante.idade} de idade, sexo ${SEXO[participante.sexo]}, email: ${participante.email}, tirou ${participante.nota}`)
        .replace("{{email_participante}}", participante.email)
        .replace("{{email_participante}}", participante.email);

      listaDeParticipantesHTML.insertAdjacentHTML('beforeend', htmlItem);
    });
  }

  //template utilizado para fazer o binding dos dados do participante.
  //Foi usado um identificador {{id}} para realizar as substituições de maneira bem simples.
  var templateItemHtml = '<li class="list-group-item d-flex justify-content-between lh-condensed">' +
    '<div><h6 class="my-0">{{nome_participante}}</h6><small class="text-muted">{{info_participante}}</small></div>' +
    '<span class="text-muted"><a href="javascript:void(0)" onclick="editar(\'{{email_participante}}\')">Editar</a> | ' +
    '<a href="javascript:void(0)" onclick="excluir(\'{{email_participante}}\')">Excluir</a> </span></li>';

  // Example starter JavaScript for disabling form submissions if there are invalid fields
  (function () {
    'use strict';

    window.addEventListener('load', function () {
      
      carregarListaDeParticipantes();

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');

      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {

          if (form.checkValidity() === false) {

            event.preventDefault();
            event.stopPropagation();

          } else {
            //usando o try conseguimos capturar o erro que ocorre quando o participante já existe
            try {
              //utilização do elemento de controle
              if (JSON.parse(form.atualizacao.value)) {

                sistema.atualizarParticipante(
                  form.nome.value,
                  form.sobrenome.value,
                  form.email.value,
                  form.idade.value,
                  form.sexo.value,
                  form.nota.value
                );

              } else {

                sistema.adicionarParticipante(
                  form.nome.value,
                  form.sobrenome.value,
                  form.email.value,
                  form.idade.value,
                  form.sexo.value
                );

                sistema.adicionarNotaAoParticipante(
                  form.email.value,
                  form.nota.value
                );

              }
              
              window.location.reload(true);

            } catch (e) {
              //interrompe o ciclo do evento de submit
              event.preventDefault();
              event.stopPropagation();
              alert(e.message);
            }
          }

          form.classList.add('was-validated');

        }, false);
      });
    }, false);
  })();