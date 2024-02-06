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

    putProducts(newProduct) {
        const products = this.getProducts();
        let pushProduct = false; // предполагая, что продукт не был добавлен
        const index = products.findIndex(product => product.id === newProduct.id);
        if (index === -1) {
            products.push({ id : newProduct.id, title : newProduct.title, desc: newProduct.description});
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
        products.forEach(product => {
            htmlCatalog += `<div class="catalog-Item">`;
            htmlCatalog += `<div class="id"> Id: ${product.id}</div>`;
            htmlCatalog += `<div class="title"> Title: ${product.title}</div>`;
            htmlCatalog += `<div class="desc"> Desc: ${product.desc}</div>`;
            htmlCatalog += `</div>`;
            sumCatalog += 1;
        }); 
        ROOT_STORE_CARD.innerHTML = `<div>Products in cart:</div>${htmlCatalog}<div>Total: ${sumCatalog}</div>`
    }
}

class Header {
    handlerOpenStoreCardPage() {
        const storeCardPage = new StoreCard();
        storeCardPage.render();
    }
    render(count) {
        ROOT_HEADER.innerHTML = `<div>Number of products in cart: ${count}</div><button onclick="headerPage.handlerOpenStoreCardPage()">Open Cart</buttton>`
    }
}

class Products {
    constructor() {
        this.classNameActive = 'active';
        this.labelAdd = 'Add to Cart';
        this.labelRemove = 'Remove from Cart';
    }

    handlerSetLocalStorage(element, id) {
        const localStorageUtil = new LocalStorageUtil();
        const { putProducts } = localStorageUtil.putProducts(id);
        element.textCotent = putProducts ? this.labelRemove : this.labelAdd;

        headerPage.render(localStorageUtil.getProducts.length);
    }

    render() {
        const localStorageUtil = new LocalStorageUtil();
        const products = localStorageUtil.getProducts();
        const htmlCatalog = '';
        products.forEach(product => {
            htmlCatalog += `<div>${product.id} <button onclick="productsPage.handlerSetLocalStorage(this, ${product.id})"/></button> </div>`
        });

        ROOT_PRODUCTS.innerHTML = htmlCatalog;
    }
}

const headerPage = new Header();
const productsPage = new Products();
// const storePage = new StoreCard();
// const spinnerPage = new ();
// const errorPage = new ();

let Catalog = [];

function render() {
    const localStorageUtil = new LocalStorageUtil();
    const productsStore = localStorageUtil.getProducts();
 
    headerPage.render(productsStore.length);
    productsPage.render();
 }

console.log('Initialization complete'); // Вывод в консоль для проверки

fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        Catalog = data.products;
        setTimeout(() => {
            const localStorageUtil = new LocalStorageUtil();
            Catalog.forEach(product => {
                localStorageUtil.putProducts(product);
            });
            render();
            // spinnerPage.handleClear()
        }, 1000);
        

    })
    .catch(() => {
        // spinnerPage.handleClear()
        // errorPage.render()
    });

