$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;

cardapio.eventos = {

  init: () => {

    cardapio.metodos.obterItensCardapio();

  }

}

cardapio.metodos = {

  // metodo para carregar os dados do cardapio
  obterItensCardapio: (categoria = 'burgers', vermais = false) => {

    var filtro = MENU[categoria];

    if (!vermais) {

      $("#itensCardapio").html('');
      $("#btnVerMais").removeClass('hidden');

    }


    $.each(filtro, (index, element) => {

      let temp = cardapio.templates.item.replace(/\${img}/g, element.img)
        .replace(/\${name}/g, element.name)
        .replace(/\${price}/g, element.price.toFixed(2).replace('.', ','))
        .replace(/\${id}/g, element.id);

      // botão ver mais for clicado (12 itens)
      if (vermais && index >= 8 && index <= 12) {

        $("#itensCardapio").append(temp);

      }

      // paginação inicial (8 itens)
      if (!vermais && index < 8) {

        $("#itensCardapio").append(temp);

      }

    })

    // remober o ativo do menu
    $(".container-menu a").removeClass('active');

    // adicionar o ativo no menu
    $("#menu-" + categoria).addClass('active');


  },

  //clique no botão ver mais
  verMais: () => {

    var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];

    cardapio.metodos.obterItensCardapio(ativo, true);

    $("#btnVerMais").addClass('hidden');

  },

  // diminuir quantidade do item no cardapio
  diminuirQuantidade: (id) => {

    let qntdAtual = parseInt($("#qntd-" + id).text());

    if (qntdAtual > 0) {

      $("#qntd-" + id).text(qntdAtual - 1)
    }

  },

  // aumentar quantidade do item no cardapio
  aumentarQuantidade: (id) => {

    let qntdAtual = parseInt($("#qntd-" + id).text());
    $("#qntd-" + id).text(qntdAtual + 1)

  },

  // adicionar item no carrinho
  adicionarAoCarrinho: (id) => {

    let qntdAtual = parseInt($("#qntd-" + id).text());

    if (qntdAtual > 0) {

      // obter categoria ativa
      var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

      // obter lista de itens da categoria
      let filtro = MENU[categoria];

      // obter item selecionado
      let item = $.grep(filtro, (e, i) => { return e.id == id });

      if (item.length > 0) {

        // validar se já existe esse item no carrinho
        let existe = $.grep(MEU_CARRINHO, (element, index) => { return element.id == id });

        // caso já exista o item no carrinho só altera a quantidade
        if (existe.length > 0) {

          let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
        }

        // caso ainda não exista o item no carrinho, adiciona ele
        else {
          item[0].qntd = qntdAtual;
          MEU_CARRINHO.push(item[0]);
        }

        cardapio.metodos.mensagem('Item adicionado ao carrinho!', 'green');
        $("#qntd-" + id).text(0);

        cardapio.metodos.atualizarBadgeTotal();

      }

    }

  },

  // atualizar o badge de totais de botões "Meu Carrinho"
  atualizarBadgeTotal: () => {

    var total = 0;

    $.each(MEU_CARRINHO, (index, element) => {

      total += element.qntd;

    })

    if (total > 0) {
      $(".botao-carrinho").removeClass('hidden');
      $(".container-total-carrinho").removeClass('hidden');
    }
    else {
      $(".botao-carrinho").addClass('hidden');
      $(".container-total-carrinho").addClass('hidden');
    }

    $(".badge-total-carrinho").html(total);

  },


  // abrir modal do carrinho
  abrirCarrinho: (abrir) => {

    if (abrir) {
      $("#modalCarrinho").removeClass('hidden');
      cardapio.metodos.carregarCarrinho();
    }
    else {
      $("#modalCarrinho").addClass('hidden');
    }

  },

  // altera os textos e exibe os botões das etapas
  carregarEtapa: (etapa) => {

    if (etapa == 1) {

      $("lblTituloEtapa").text('Seu carrinho:');
      $("#itensCarrinho").removeClass('hidden');
      $("#localEntrega").addClass('hidden');
      $("#resumoCarrinho").addClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');

      $("#btnEtapaPedido").removeClass('hidden');
      $("#btnEtapaEndereco").addClass('hidden');
      $("#btnEtapaResumo").addClass('hidden');
      $("#btnVoltar").addClass('hidden');

    }
    if (etapa == 2) {

      $("lblTituloEtapa").text('Endereço de entrega:');
      $("#itensCarrinho").addClass('hidden');
      $("#localEntrega").removeClass('hidden');
      $("#resumoCarrinho").addClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');
      $(".etapa2").addClass('active');

      $("#btnEtapaPedido").addClass('hidden');
      $("#btnEtapaEndereco").removeClass('hidden');
      $("#btnEtapaResumo").addClass('hidden');
      $("#btnVoltar").removeClass('hidden');

    }

    if (etapa == 3) {

      $("lblTituloEtapa").text('Resumo do pedido:');
      $("#itensCarrinho").addClass('hidden');
      $("#localEntrega").addClass('hidden');
      $("#resumoCarrinho").removeClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');
      $(".etapa2").addClass('active');
      $(".etapa3").addClass('active');

      $("#btnEtapaPedido").addClass('hidden');
      $("#btnEtapaEndereco").addClass('hidden');
      $("#btnEtapaResumo").removeClass('hidden');
      $("#btnVoltar").removeClass('hidden');

    }
  },

  // botão voltar etapa
  voltarEtapa: () => {

    let etapa = $(".etapa.active").length;
    cardapio.metodos.carregarEtapa(etapa - 1);

  },

  // carrega lista de itens do carrinho
  carregarCarrinho: () => {

    cardapio.metodos.carregarEtapa(1);

    if (MEU_CARRINHO.length > 0) {

      $("#itensCarrinho").html('');

      $.each(MEU_CARRINHO, (index, element) => {
        let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, element.img)
          .replace(/\${name}/g, element.name)
          .replace(/\${price}/g, element.price.toFixed(2).replace('.', ','))
          .replace(/\${id}/g, element.id)
          .replace(/\${qntd}/g, element.qntd);

        $("#itensCarrinho").append(temp);

        // ultimo item do carrinho
        if ((index + 1) == MEU_CARRINHO.length) {
            cardapio.metodos.carregarValores();
        }

      });

    }
    else {
      $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio!</p>');
      cardapio.metodos.carregarValores();
    }

  },

  // diminuir quantidade do item no carrinho
  diminuirQuantidadeCarrinho: (id) => {

    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

    if (qntdAtual > 1) {

      $("#qntd-carrinho-" + id).text(qntdAtual - 1)
      cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1)
    }
    else {
      cardapio.metodos.removerItemCarrinho(id);
    }

  },

  // aumentar quantidade do item no carrinho
  aumentarQuantidadeCarrinho: (id) => {

    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
    $("#qntd-carrinho-" + id).text(qntdAtual + 1)
    cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1)

  },

  // remover item do carrinho
  removerItemCarrinho: (id) => {

    MEU_CARRINHO = $.grep(MEU_CARRINHO, (element, index) => { return element.id != id });
    cardapio.metodos.carregarCarrinho();

    // atualizar o botão carrinho com a quantidade atualizada.
    cardapio.metodos.atualizarBadgeTotal();

  },

  // atualizar total do carrinho com a quantidade atual.
  atualizarCarrinho: (id, qntd) => {

    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
    MEU_CARRINHO[objIndex].qntd = qntd;

    // atualizar o botão carrinho com a quantidade atualizada.
    cardapio.metodos.atualizarBadgeTotal();

    // atualizar os valores totai do carrinho
    cardapio.metodos.carregarValores();

  },

  // carrega os valores SubTotal, taxa de entrega e total do carrinho
  carregarValores: () => {

    VALOR_CARRINHO = 0;
    $("#lblSubTotal").text('R$ 0,00');
    $("#lblValorEntrega").text('+ R$ 0,00');
    $("#lblValorTotal").text('R$ 0,00');

    $.each(MEU_CARRINHO, (index, element) => {
      VALOR_CARRINHO += parseFloat(element.price * element.qntd);

      if ((index + 1) == MEU_CARRINHO.length) {

        $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
        $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
        $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);

      }
    });

  },

  // carregar lista de endereços
  carregarEndereco: () => {

    if(MEU_CARRINHO.length <= 0) {
      cardapio.metodos.mensagem('Seu carrinho está vazio.');
      return;
    }

    cardapio.metodos.carregarEtapa(2);

  },

  // Buscar endereço pelo CEP (ViaCEP)
  buscarCep: () => {

    // cria a variavel cep e remove os caracteres especiais
    var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

    if(cep != '') {

      var validacep = /^[0-9]{8}$/;
      
      if(validacep.test(cep)) {

       $.getJSON(`https://viacep.com.br/ws/${cep}/json/?callback=?`, function (dados) {

        if (!("erro" in dados)) {

          $("#txtEndereco").val(dados.logradouro);
          $("#txtBairro").val(dados.bairro);
          $("#txtCidade").val(dados.localidade);
          $("#ddlUf").val(dados.uf);
          $("#txtNumero").focus();

        }
        else {
          cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
          $("#txtEndereco").focus();
        }

       }) 

      }
      else {
        cardapio.metodos.mensagem('CEP inválido.');
        $("#txtCEP").focus();
      }

    }
    else {
      cardapio.metodos.mensagem('Por favor, informe seu CEP.');
      $("#txtCEP").focus();
    }

  },

  // finalizar pedido
  resumoPedido: () => {
    const camposObrigatorios = [
      { campo: "#txtCEP", mensagem: "Por favor, informe seu CEP." },
      { campo: "#txtEndereco", mensagem: "Por favor, informe seu endereço." },
      { campo: "#txtBairro", mensagem: "Por favor, informe seu bairro." },
      { campo: "#txtCidade", mensagem: "Por favor, informe sua cidade." },
      { campo: "#ddlUf", mensagem: "Por favor, informe seu estado." },
      { campo: "#txtNumero", mensagem: "Por favor, informe o número do seu endereço." }
    ];
  
    for (const campo of camposObrigatorios) {
      const valor = $(campo.campo).val().trim();
      if (valor === "") {
        cardapio.metodos.mensagem(campo.mensagem);
        $(campo.campo).focus();
        return;
      }
    }
  
    const cep = $("#txtCEP").val().trim();
    const endereco = $("#txtEndereco").val().trim();
    const bairro = $("#txtBairro").val().trim();
    const cidade = $("#txtCidade").val().trim();
    const uf = $("#ddlUf").val().trim();
    const numero = $("#txtNumero").val().trim();
    const complemento = $("#txtComplemento").val().trim();
  
    MEU_ENDERECO = {
      cep: cep,
      endereco: endereco,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      numero: numero,
      complemento: complemento
    };
  
    cardapio.metodos.carregarEtapa(3);
    cardapio.metodos.carregarResumo();
  },

  // carrega a etapa de resumo do pedido
  carregarResumo: () => {

    $("#listaItensResumo").html('');
    
    $.each(MEU_CARRINHO, (index, element) => {

      let temp = cardapio.templates.itemResumo.replace(/\${img}/g, element.img)
        .replace(/\${name}/g, element.name)
        .replace(/\${price}/g, element.price.toFixed(2).replace('.', ','))
        .replace(/\${qntd}/g, element.qntd);

        $("#listaItensResumo").append(temp);

    });

    $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
    $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

  },

  // atualiza o link do botão do WhatsApp
  finalizarPedido: () => {
    
  },
  



  // mensagens de alerta
  mensagem: (texto, cor = 'red', tempo = 3500) => {

    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

    $("#container-mensagens").append(msg);

    setTimeout(() => {
      $("#msg-" + id).remove('fadeInDown');
      $("#msg-" + id).addClass('fadeOutUp');
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800);
    }, tempo);
  },

}

cardapio.templates = {

  item: `
    <div class="col-3 mb-5">
      <div class="card card-item" id= "\${id}">
        <div class="img-produto">
        <img src="\${img}"/>
        </div>
        <p class="title-produto text-center mt-4">
          <b>\${name}</b>
        </p>
        <p class="price-produto text-center">
          <b>R$ \${price}</b>
        </p>
        <div class="add-carrinho">
          <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')">
            <i class="fas fa-minus"></i>
          </span>
          <span class="add-numero-itens" id="qntd-\${id}">0</span>
          <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')">
            <i class="fas fa-plus"></i>
          </span>
          <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')">
            <i class="fa fa-shopping-bag"></i>
          </span>
        </div>
      </div>                
    </div>
  `,

  itemCarrinho: `
    <div class="col-12 item-carrinho">
      <div class="img-produto">
        <img src="\${img}" alt="hamburger">
      </div>
      <div class="dados-produto">
        <p class="title-produto"><b>\${name}</b></p>
        <p class="price-produto"><b>R$ \${price}</b></p>
      </div>
      <div class="add-carrinho">
      <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')">
        <i class="fas fa-minus"></i>
      </span>
      <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
      <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')">
        <i class="fas fa-plus"></i>
      </span>
      <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')">
        <i class="fa fa-times"></i></span>
      </div>
    </div>
  `,

  itemResumo: `
    <div class="col-12 item-carrinho resumo">
      <div class="img-produto-resumo">
        <img src="\${img}" />
      </div>
      <div class="dados-produto">
        <p class="title-produto-resumo">
          <b>\${name}</b>
        </p>
        <p class="price-produto-resumo">
          <b>R$ \${price}</b>
        </p>
      </div>
      <p class="quantidade-resumo-produto">
        x <b>\${qntd}</b>
      </p>
    </div>
  `
}