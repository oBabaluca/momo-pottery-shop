/* =========================================
   MOMO POTTERY SHOP
========================================= */

/* =========================================
   FORMATAR PREÇO
========================================= */

function formatPrice(price) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/* =========================================
   RENDERIZAR PRODUTOS EM DESTAQUE
========================================= */

function renderFeaturedProducts() {
  const container = document.querySelector("#featured-products");

  console.log("Container:", container);

  if (!container) {
    console.error("Container #featured-products não encontrado.");
    return;
  }

  const featuredProducts = products
    .filter((product) => product.destaque === true)
    .slice(0, 4);

  console.log("Produtos em destaque:", featuredProducts);

  container.innerHTML = featuredProducts
    .map((product) => {
      return `
            <article class="product-card">

                <div class="product-image-wrapper">

                    <a
                        href="pages/produto.html?id=${product.id}"
                        class="product-image-link"
                    >

                        <img
                            src="assets/images/${product.imagem}"
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


                    <a href="pages/produto.html?id=${product.id}">

                        <h3>
                            ${product.nome}
                        </h3>

                    </a>


                    <span class="product-price">
                        ${formatPrice(product.preco)}
                    </span>

                </div>

            </article>
        `;
    })
    .join("");
}

/* =========================================
   INICIAR HOME
========================================= */

renderFeaturedProducts();

/* =========================================
   MENU MOBILE
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
}

/* =========================================
   HEADER AO ROLAR
========================================= */

const header = document.querySelector(".header");

function updateHeaderOnScroll() {
  if (!header) {
    return;
  }

  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateHeaderOnScroll);

updateHeaderOnScroll();
