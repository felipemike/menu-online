$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

cardapio.eventos = {

  init: () => {

    cardapio.metodos.obterItensCardapio();

  }

}

cardapio.metodos = {

  // metodo para carregar os dados do cardapio
  obterItensCardapio: (categoria = 'burgers') => {

    var filtro = MENU[categoria];

    $("#itensCardapio").html('');

    $.each(filtro, (index, element) => {

      let temp = cardapio.template.item.replace(/\${img}/g, element.img)
        .replace(/\${name}/g, element.name)
        .replace(/\${price}/g, element.price.toFixed(2).replace('.', ','));


      $("#itensCardapio").append(temp);

    })

    // remober o ativo do menu
    $(".container-menu a").removeClass('active');

    // adicionar o ativo no menu
    $("#menu-" + categoria).addClass('active');


  },

}

cardapio.template = {

  item: `
    <div class="col-3 mb-5">
      <div class="card card-item">
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
          <span class="btn-menos"><i class="fas fa-minus"></i></span>
          <span class="add-numero-itens">0</span>
          <span class="btn-mais"><i class="fas fa-plus"></i></span>
          <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>
        </div>
      </div>                
    </div>
  `
}