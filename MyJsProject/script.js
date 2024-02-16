const ROOT_PRODUCTS = document.getElementById('root_products');
const ROOT_HEADER = document.getElementById('root_header');
const ROOT_STORE_CARD = document.getElementById('root_store_card');
const ROOT_LOADER = document.getElementById('root_loader');
const ROOT_ERROR = document.getElementById('root_error');

// localStorage.clear();

class LocalStorageUtil {
    constructor() {
        this.keyName = 'products';
    }

    getProducts() {
        const products = localStorage.getItem(this.keyName);
        return products ? JSON.parse(products) : [];
    }

    putProducts(id) {
        const products = this.getProducts();
        let pushProduct = false; // предполагая, что продукт не был добавлен
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            products.push({ id: id});
            pushProduct = true;
        } else {
            products.splice(index, 1);
        }

        localStorage.setItem(this.keyName, JSON.stringify(products));

        return { pushProduct, products };
    }

}

class StoreCard {
    handlerClear() {
        ROOT_STORE_CARD.innerHTML = '';
    }

    render() {
        const localStorageUtil = new LocalStorageUtil();
        const products = localStorageUtil.getProducts();
        let htmlCatalog = '';
        let sumCatalog = 0;
        Catalog.forEach(product => {
            const productInCart = products.find(item => item.id === product.id);
            if (productInCart) {
                htmlCatalog += `<div class="item"> <h4> ${product.title} ---- $ ${product.price}</h4></div> `;
                sumCatalog += product.price;
            }
        });
        console.log(htmlCatalog);
        ROOT_STORE_CARD.innerHTML = `<h2 class="title">Products in cart: </h2> <div class="shopping-items">${htmlCatalog}</div> <h3>Total: ${sumCatalog}</h3>`
    }
} 
class Header {
    handlerOpenStoreCardPage() {
        const storeCardPage = new StoreCard();
        storeCardPage.render();
    }
    render(count) {
        headerPage.handlerOpenStoreCardPage();

        ROOT_HEADER.innerHTML = `<h3 >Number of products in cart: ${count}</h3> <button class="update-button"onclick="headerPage.handlerOpenStoreCardPage()">Updates Card</buttton>`
    }
}

class Products {
    constructor() {
        this.classNameActive = 'active';
        this.labelAdd = 'Add to Cart';
        this.labelRemove = 'Remove from Cart';
    }

    handlerSetLocalStorage(element, id) {
        const { pushProduct, products } = localStorageUtil.putProducts(id);
        if (pushProduct) {
            element.classList.add(this.classNameActive);
            element.innerHTML = this.labelRemove;
        } else {
            element.classList.remove(this.classNameActive);
            element.innerHTML = this.labelAdd;
        }
        headerPage.render(products.length);
    }

    render() {
        const products = localStorageUtil.getProducts(); 
        let htmlStore = ``;
        Catalog.forEach(product => {
            const inCart = products.some(item => item.id === product.id);

            console.log(product); 
            // htmlStore += `<button onclick="productsPage.handlerSetLocalStorage(this, ${product.id})"> d</button>`;
             htmlStore += `<div class="item-shop">`;
            htmlStore += `<img class="image-box" src="${product.thumbnail}" alt="Product Image">`;
            htmlStore += `<div class="about"> <h3>${product.title}</h3> <p>${product.price}$</p> <p>${product.description}</p> </div>`;
            htmlStore += `<button class="${inCart ? this.classNameActive : ''}" onclick="productsPage.handlerSetLocalStorage(this, ${product.id})"> ${inCart ? this.labelRemove : this.labelAdd}</button>`;
            htmlStore += `</div>`; 
        });
        ROOT_PRODUCTS.innerHTML = htmlStore;
    }
}

// Функция для обновления интерфейса страницы
function render() {
    const productsStore = localStorageUtil.getProducts();
    headerPage.render(productsStore.length);
    headerPage.handlerOpenStoreCardPage()
    productsPage.render();
}

 let Catalog = [];

 const localStorageUtil = new LocalStorageUtil();
const storeCardPage = new StoreCard();
const headerPage = new Header();
const productsPage = new Products();
  
render();
renderDataFromApi();
function renderDataFromApi() {
    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            Catalog = data.products;
            setTimeout(() => {
                // const localStorageUtil = new LocalStorageUtil();
                Catalog.splice(5);
                productsPage.render();

                // spinnerPage.handleClear()
            }, 1000);


        })
        .catch(() => {
            // spinnerPage.handleClear()
            // errorPage.render()
        }); 
}