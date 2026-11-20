/* =========================================
   MOMO POTTERY SHOP
   LOJA
========================================= */

/* =========================================
   ELEMENTOS
========================================= */

const shopProductsContainer = document.querySelector("#shop-products");

const searchInput = document.querySelector("#shop-search-input");

const clearSearchButton = document.querySelector("#clear-search");

const filterButtons = document.querySelectorAll(".filter-button");

const sortSelect = document.querySelector("#sort-products");

const productsCount = document.querySelector("#products-count");

const noProducts = document.querySelector("#no-products");

const resetFiltersButton = document.querySelector("#reset-filters");

const headerSearchButton = document.querySelector(".shop-search-button");

/* =========================================
   ESTADO
========================================= */

let currentCategory = "todos";

let currentSearch = "";

let currentSort = "default";

/* =========================================
   FORMATAR PREÇO
========================================= */

function formatShopPrice(price) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/* =========================================
   OBTER PRODUTOS FILTRADOS
========================================= */

function getFilteredProducts() {
  let filteredProducts = [...products];

  /* =====================================
       CATEGORIA
    ===================================== */

  if (currentCategory !== "todos") {
    filteredProducts = filteredProducts.filter(
      (product) => product.categoria === currentCategory,
    );
  }

  /* =====================================
       PESQUISA
    ===================================== */

  if (currentSearch) {
    const search = currentSearch.toLowerCase().trim();

    filteredProducts = filteredProducts.filter((product) => {
      const name = product.nome.toLowerCase();

      const category = product.categoria.toLowerCase();

      return name.includes(search) || category.includes(search);
    });
  }

  /* =====================================
       ORDENAÇÃO
    ===================================== */

  switch (currentSort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.preco - b.preco);

      break;

    case "price-high":
      filteredProducts.sort((a, b) => b.preco - a.preco);

      break;

    case "name":
      filteredProducts.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

      break;
  }

  return filteredProducts;
}

/* =========================================
   RENDERIZAR PRODUTOS
========================================= */

function renderShopProducts() {
  if (!shopProductsContainer) {
    return;
  }

  const filteredProducts = getFilteredProducts();

  /* =====================================
       CONTADOR
    ===================================== */

  if (productsCount) {
    productsCount.textContent = `${filteredProducts.length} ${
      filteredProducts.length === 1 ? "peça" : "peças"
    }`;
  }

  /* =====================================
       NENHUM RESULTADO
    ===================================== */

  if (filteredProducts.length === 0) {
    shopProductsContainer.innerHTML = "";

    noProducts?.classList.add("visible");

    return;
  }

  noProducts?.classList.remove("visible");

  /* =====================================
       PRODUTOS
    ===================================== */

  shopProductsContainer.innerHTML = filteredProducts
    .map((product) => {
      return `

                    <article class="product-card">


                        <div class="product-image-wrapper">


                            <a
                                href="produto.html?id=${product.id}"
                                class="product-image-link"
                            >

                                <img
                                    src="../assets/images/${product.imagem}"
                                    alt="${product.nome}"
                                >

                            </a>



                            <button
                                class="favorite-button"
                                aria-label="Adicionar ${product.nome} aos favoritos"
                                data-product-id="${product.id}"
                            >

                                <i class="fa-regular fa-heart"></i>

                            </button>



                            <button
                                class="add-cart-button"
                                data-product-id="${product.id}"
                            >
                                Adicionar ao carrinho
                            </button>


                        </div>



                        <div class="product-info">


                            <span class="product-category">

                                ${product.categoria}

                            </span>


                            <a
                                href="produto.html?id=${product.id}"
                            >

                                <h3>
                                    ${product.nome}
                                </h3>

                            </a>


                            <span class="product-price">

                                ${formatShopPrice(product.preco)}

                            </span>


                        </div>


                    </article>

                `;
    })
    .join("");
}

/* =========================================
   FILTROS
========================================= */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filter) => filter.classList.remove("active"));

    button.classList.add("active");

    currentCategory = button.dataset.category;

    renderShopProducts();
  });
});

/* =========================================
   PESQUISA
========================================= */

searchInput?.addEventListener("input", (event) => {
  currentSearch = event.target.value;

  clearSearchButton?.classList.toggle("visible", currentSearch.length > 0);

  renderShopProducts();
});

/* =========================================
   LIMPAR PESQUISA
========================================= */

clearSearchButton?.addEventListener("click", () => {
  searchInput.value = "";

  currentSearch = "";

  clearSearchButton.classList.remove("visible");

  renderShopProducts();

  searchInput.focus();
});

/* =========================================
   ORDENAÇÃO
========================================= */

sortSelect?.addEventListener("change", (event) => {
  currentSort = event.target.value;

  renderShopProducts();
});

/* =========================================
   RESET
========================================= */

resetFiltersButton?.addEventListener("click", () => {
  currentCategory = "todos";

  currentSearch = "";

  currentSort = "default";

  if (searchInput) {
    searchInput.value = "";
  }

  if (sortSelect) {
    sortSelect.value = "default";
  }

  clearSearchButton?.classList.remove("visible");

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === "todos");
  });

  renderShopProducts();
});

/* =========================================
   LUPA DO HEADER
========================================= */

headerSearchButton?.addEventListener("click", () => {
  searchInput?.scrollIntoView({
    behavior: "smooth",

    block: "center",
  });

  setTimeout(() => {
    searchInput?.focus();
  }, 400);
});

/* =========================================
   FILTRO PELA URL
========================================= */

function loadCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const category = params.get("categoria");

  if (!category) {
    return;
  }

  const matchingButton = [...filterButtons].find(
    (button) =>
      button.dataset.category.toLowerCase() === category.toLowerCase(),
  );

  if (!matchingButton) {
    return;
  }

  filterButtons.forEach((button) => button.classList.remove("active"));

  matchingButton.classList.add("active");

  currentCategory = matchingButton.dataset.category;
}

/* =========================================
   INICIALIZAÇÃO
========================================= */

loadCategoryFromUrl();

renderShopProducts();
