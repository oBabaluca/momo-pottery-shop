/* =========================================
   MOMO POTTERY SHOP
   CARRINHO
========================================= */

const CART_KEY = "momo_cart";

/* =========================================
   FORMATAR PREÇO
========================================= */

function formatCartPrice(price) {
  return price.toLocaleString("pt-BR", {
    style: "currency",

    currency: "BRL",
  });
}

/* =========================================
   PEGAR CARRINHO
========================================= */

function getCart() {
  const cart = localStorage.getItem(CART_KEY);

  return cart ? JSON.parse(cart) : [];
}

/* =========================================
   SALVAR CARRINHO
========================================= */

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  updateCartCount();

  renderCart();
}

/* =========================================
   ADICIONAR PRODUTO
========================================= */

function addToCart(productId) {
  const id = Number(productId);

  const product = products.find((product) => product.id === id);

  if (!product) {
    console.error("Produto não encontrado:", id);

    return;
  }

  const cart = getCart();

  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantidade++;
  } else {
    cart.push({
      id: id,

      quantidade: 1,
    });
  }

  saveCart(cart);
}

/* =========================================
   AUMENTAR QUANTIDADE
========================================= */

function increaseQuantity(productId) {
  const cart = getCart();

  const item = cart.find((item) => item.id === productId);

  if (!item) {
    return;
  }

  item.quantidade++;

  saveCart(cart);
}

/* =========================================
   DIMINUIR QUANTIDADE
========================================= */

function decreaseQuantity(productId) {
  const cart = getCart();

  const item = cart.find((item) => item.id === productId);

  if (!item) {
    return;
  }

  if (item.quantidade > 1) {
    item.quantidade--;
  } else {
    removeFromCart(productId);

    return;
  }

  saveCart(cart);
}

/* =========================================
   REMOVER PRODUTO
========================================= */

function removeFromCart(productId) {
  const cart = getCart();

  const newCart = cart.filter((item) => item.id !== productId);

  saveCart(newCart);
}

/* =========================================
   CONTADOR DO HEADER
========================================= */

function updateCartCount() {
  const cart = getCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantidade,

    0,
  );

  const counters = document.querySelectorAll(".cart-count");

  counters.forEach((counter) => {
    counter.textContent = totalItems;
  });
}

/* =========================================
   RENDERIZAR CARRINHO
========================================= */

function renderCart() {
  const container = document.querySelector("#cart-items");

  /*
        Se não estivermos na página
        do carrinho, não fazemos nada.
    */

  if (!container) {
    return;
  }

  const cart = getCart();

  /* =====================================
       CARRINHO VAZIO
    ===================================== */

  if (cart.length === 0) {
    container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">

                    <i class="fa-solid fa-bag-shopping"></i>

                </div>

                <h2>
                    Seu carrinho está vazio
                </h2>

                <p>
                    Que tal encontrar uma peça
                    especial para chamar de sua?
                </p>

                <a
                    href="loja.html"
                    class="primary-button"
                >
                    Conhecer as peças
                </a>

            </div>

        `;

    updateCartSummary([]);

    return;
  }

  /* =====================================
       PRODUTOS
    ===================================== */

  container.innerHTML = cart
    .map((item) => {
      const product = products.find((product) => product.id === item.id);

      if (!product) {
        return "";
      }

      const itemTotal = product.preco * item.quantidade;

      return `

                <article class="cart-item">

                    <a
                        href="produto.html?id=${product.id}"
                        class="cart-item-image"
                    >

                        <img
                            src="../assets/images/${product.imagem}"
                            alt="${product.nome}"
                        >

                    </a>


                    <div class="cart-item-info">

                        <span class="cart-item-category">

                            ${product.categoria}

                        </span>


                        <a
                            href="produto.html?id=${product.id}"
                        >

                            <h2>
                                ${product.nome}
                            </h2>

                        </a>


                        <span class="cart-item-price">

                            ${formatCartPrice(product.preco)}

                        </span>


                        <div class="cart-item-actions">


                            <div class="quantity-selector">

                                <button
                                    class="quantity-button decrease"
                                    data-product-id="${product.id}"
                                    aria-label="Diminuir quantidade"
                                >
                                    −
                                </button>


                                <span class="quantity-value">

                                    ${item.quantidade}

                                </span>


                                <button
                                    class="quantity-button increase"
                                    data-product-id="${product.id}"
                                    aria-label="Aumentar quantidade"
                                >
                                    +
                                </button>

                            </div>


                            <button
                                class="remove-cart-item"
                                data-product-id="${product.id}"
                            >

                                <i class="fa-regular fa-trash-can"></i>

                                Remover

                            </button>

                        </div>

                    </div>


                    <strong class="cart-item-total">

                        ${formatCartPrice(itemTotal)}

                    </strong>

                </article>

            `;
    })
    .join("");

  updateCartSummary(cart);
}

/* =========================================
   RESUMO DO CARRINHO
========================================= */

function updateCartSummary(cart) {
  const subtotalElement = document.querySelector("#cart-subtotal");

  const totalElement = document.querySelector("#cart-total");

  const itemsElement = document.querySelector("#summary-items");

  const checkoutButton = document.querySelector("#checkout-button");

  if (!subtotalElement || !totalElement || !itemsElement) {
    return;
  }

  let subtotal = 0;

  let totalItems = 0;

  cart.forEach((item) => {
    const product = products.find((product) => product.id === item.id);

    if (!product) {
      return;
    }

    subtotal += product.preco * item.quantidade;

    totalItems += item.quantidade;
  });

  subtotalElement.textContent = formatCartPrice(subtotal);

  totalElement.textContent = formatCartPrice(subtotal);

  itemsElement.textContent = `${totalItems} ${
    totalItems === 1 ? "item" : "itens"
  }`;

  /* Desativa checkout se vazio */

  if (checkoutButton) {
    checkoutButton.classList.toggle("disabled", totalItems === 0);
  }
}

/* =========================================
   CLIQUES
========================================= */

document.addEventListener("click", (event) => {
  /* =====================================
           ADICIONAR
        ===================================== */

  const addButton = event.target.closest(".add-cart-button");

  if (addButton) {
    const productId = Number(addButton.dataset.productId);

    addToCart(productId);

    const originalText = addButton.textContent;

    addButton.textContent = "Adicionado ♡";

    addButton.classList.add("added");

    setTimeout(() => {
      addButton.textContent = originalText;

      addButton.classList.remove("added");
    }, 1200);

    return;
  }

  /* =====================================
           AUMENTAR
        ===================================== */

  const increaseButton = event.target.closest(".increase");

  if (increaseButton) {
    increaseQuantity(Number(increaseButton.dataset.productId));

    return;
  }

  /* =====================================
           DIMINUIR
        ===================================== */

  const decreaseButton = event.target.closest(".decrease");

  if (decreaseButton) {
    decreaseQuantity(Number(decreaseButton.dataset.productId));

    return;
  }

  /* =====================================
           REMOVER
        ===================================== */

  const removeButton = event.target.closest(".remove-cart-item");

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.productId));
  }
});

/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  renderCart();
});
