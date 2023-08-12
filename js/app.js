$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];

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

      let temp = cardapio.template.item.replace(/\${img}/g, element.img)
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

        $("#qntd-" + id).text(0);

      }


    }

  },

}

cardapio.template = {

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
  `
}