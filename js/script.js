let products = []; //leidos desde el json
let cart = [];  //cargados en el carrito

const nav__menu = document.querySelector('.navBar__menu');
const btn__nav = document.querySelector('.btn__nav');

const navLogo = document.querySelector('.navBar__logo');

const btnNavProductos = document.querySelector('#btnNavProductos');
const btnNavCarteras = document.querySelector('#btnNavCarteras');
const btnNavBolsos = document.querySelector('#btnNavBolsos');
const btnNavCE = document.querySelector('#btnNavCE');
const btnNavVerTodos = document.querySelector('#btnNavVerTodos');

const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
searchInput.value = '';
const productNotFoundedAlert = document.querySelector('#productNotFoundedAlert');

const mainInformation = document.querySelector('#mainInformation');

const productsInformationTitle = document.querySelector('.productsInformation__title');
const productsInformationResults = document.querySelector('.productsInformation__results');

const productsInformation = document.querySelector('#productsInformation');
const productsContainer = document.querySelector('.productsContainer'); //contenedor
const templateContainerProducts = document.getElementById("template-containerProducts").content; // items en contenedor
const fragmentProduct = document.createDocumentFragment();//guardar cada item y luego insertarlo en el contenedor

const cartView = document.querySelector('.cart');
const cartList = document.getElementById('cart__items'); //contenedor de productos en el carrito
const templateCartProducts = document.getElementById("template-CartProducts").content; //template para cargar los items en el carrito
const fragmentCart = document.createDocumentFragment();//insertarlo en el carrito
const cartResumeTotal = document.querySelector('.cart__sideContainer__resume__total');
const btnFinishBuy = document.querySelector('.cart__sideContainer__resume__btnFinishBuy');
const productAddToast = document.querySelector('.productAddToast');
const cartProductsCounter = document.querySelector('.navBar__menu__btnCartMenu-counter');
const cartProductsCounterResponsive = document.querySelector('.navBar__btnCartResponsive-counter');


const btnFooterBolsos = document.querySelector('#btnFooterBolsos');
const btnFooterCE = document.querySelector('#btnFooterCE');
const btnFooterVerTodos = document.querySelector('#btnFooterVerTodos');
const btnFooterCarteras = document.querySelector('#btnFooterCarteras');




document.addEventListener('DOMContentLoaded', () => { 
        fetchData();
        checkCartLocalStorage();
        addEventShowCart();
});

//Carrito en localstorage
const checkCartLocalStorage = () => {
        const cartStorage = localStorage.getItem('cart');
        if (cartStorage) {
                cart = JSON.parse(cartStorage);
                updateCartProductView()
                let units = arrayLength(cart);
                cartProductsCounter.textContent = units;
                cartProductsCounterResponsive.textContent = units;
        }
};

const fetchData = async () => {
        try {
                const res = await fetch(`./assets/products.json`);
                const data = await res.json();
                products = data; //almaceno los datos del archivo en un array
                loadRandomProductsToContainer(products);
        } catch (error) {
                console.log(error)
        }
}


//Cargar contenedor de productos 
const loadRandomProductsToContainer = (data) => {
        let randomProducts = [];
        let randomNumbers = [];
        let i = 0;
        while (i < 12) {
                num = Math.floor(Math.random() * data.length);//numero random entre 0 y el tamaño del array 
                if (!randomNumbers.includes(num)) {
                        randomNumbers.push(num);
                        i++;
                        continue;
                }
        }
        randomNumbers.forEach(id => {
                randomProducts.push(data[id]);
        });
        loadContainerProducts(randomProducts);
}

const loadContainerProducts = (data) => {
        productsContainer.innerHTML = '';
        data.forEach(product => {
                templateContainerProducts.querySelectorAll('img')[0].setAttribute('src', `./assets/img/${product.imgFrontUrl}`);
                templateContainerProducts.querySelectorAll('img')[0].setAttribute('alt', `${product.name}`);
                templateContainerProducts.querySelectorAll('img')[1].setAttribute('src', `./assets/img/${product.imgBackUrl}`);
                templateContainerProducts.querySelectorAll('img')[1].setAttribute('alt', `${product.name}`);
                templateContainerProducts.querySelector('h3').textContent = `${product.name} ${product.year}`;
                templateContainerProducts.querySelector('p').textContent = `$${product.price}`;
                templateContainerProducts.querySelector('.productsContainer__item__button').dataset.id = product.id; //guardo en el boton el id de ese producto

                const clone = templateContainerProducts.cloneNode(true);
                fragmentProduct.appendChild(clone);
        });
        productsContainer.appendChild(fragmentProduct);
}


//btn Sumar al carrito-->
productsContainer.addEventListener("click", (e) => {
        addCart(e);
});

const addCart = e => {
        if (e.target.classList.contains('fa-cart-plus')) { //icono
                setCart(e.target.parentElement.parentElement);
        } else {
                if (e.target.classList.contains('productsContainer__item__button')) { //boton
                        setCart(e.target.parentElement);
                }
        }
        e.stopPropagation();
}

//Crea un objeto con los datos y lo agrega al array cart
const setCart = (object) => {
        const product = {
                id: object.querySelector('button').dataset.id,
                name: object.querySelector('h3').textContent,
                price: object.querySelector('p').textContent,
                img: object.querySelector('img').getAttribute('src'),
                units: 1
        }
        if (cart[product.id]) { //le aumento una unidad
                product.units = cart[product.id].units + 1;
        }
        cart[product.id] = { ...product }
        localStorage.setItem('cart', JSON.stringify(cart)); //actualizar
        updateCartProductView();
        cartProductsCounter.textContent = arrayLength(cart);
        cartProductsCounterResponsive.textContent = arrayLength(cart);
        if (!productAddToast.classList.contains('show')) {
                productAddToast.classList.toggle('show');
                setTimeout(() => {
                        productAddToast.classList.toggle('show');
                }, 1500)
        }



}


//la vista de productos en el carrito
function updateCartProductView() {
        let totalPrice = 0;
        cartList.innerHTML = '';
        cart.forEach(product => {
                if (product) {
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__main__name").textContent = product.name;
                        templateCartProducts.querySelector("img").setAttribute("src", `${product.img}`);
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__number").textContent = product.units;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__price").textContent = `$${Number(product.price.slice(1)) * product.units}`;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__main__btnDelete").dataset.id = product.id;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__btn__add").dataset.id = product.id;
                        templateCartProducts.querySelector(".cart__sideContainer__items__item__description__units__btn__rest").dataset.id = product.id;

                        totalPrice += Number(product.price.slice(1)) * product.units; //quita el $ de product.price
                        const clone = templateCartProducts.cloneNode(true);
                        fragmentCart.appendChild(clone);
                }
        });
        cartList.appendChild(fragmentCart);
        if(totalPrice==0){
                cartResumeTotal.textContent = 'Carrito vacio';
        }else {
                if(!btnFinishBuy.classList.contains('show'))
                        btnFinishBuy.classList.toggle('show');
                cartResumeTotal.textContent = `Total a pagar: $${totalPrice}`;
        }
        if(arrayLength(cart)==0){
                if(btnFinishBuy.classList.contains('show'))
                        btnFinishBuy.classList.toggle('show');
        }
        
}

//Modificar productos en carrito
cartList.addEventListener('click', (e) => {
        cartProductsModify(e);
});

const cartProductsModify = (e) => {
        //Aumentar unidades
        if (e.target.classList.contains('fa-plus')) { 
                plusProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__description__units__btn__add')) { 
                        plusProductCart(e.target.dataset.id);
                }
        }

        //Disminuir unidades
        if (e.target.classList.contains('fa-minus')) { 
                minusProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__description__units__btn__rest')) {
                        minusProductCart(e.target.dataset.id);
                }
        }

        //Eliminar producto 
        if (e.target.classList.contains('fa-trash')) {
                eliminarProductCart(e.target.parentElement.dataset.id);
        } else {
                if (e.target.classList.contains('cart__sideContainer__items__item__main__btnDelete')) {
                        eliminarProductCart(e.target.dataset.id);
                }
        }
        cartProductsCounter.textContent = arrayLength(cart);
        cartProductsCounterResponsive.textContent = arrayLength(cart);
        e.stopPropagation();
};

const plusProductCart = (id) => {
        const product = cart[id];
        product.units++;
        cart[id] = { ...product };
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
};

const minusProductCart = (id) => {
        const product = cart[id];
        product.units--;
        if (product.units === 0) {
                delete cart[id];
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
};

const eliminarProductCart = (id) => {
        delete cart[id];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartProductView();
}

//-----Buscar producto
searchInput.addEventListener('keyup', (e) => {
        

        if (searchInput.value == 0) {
                if (productNotFoundedAlert.classList.contains('show'))//si el input está vacio, quita el cartel no encontrado
                        productNotFoundedAlert.classList.toggle('show');
                productsContainer.innerHTML = '';
                productsInformationTitle.textContent=`Descubrí nuestros productos`;
                productsInformationResults.textContent=``;
                        loadRandomProductsToContainer(products);
                        e.preventDefault();//evita recarga de pagina
                        scrollTo(0,productsInformation.offsetTop - 50);


        }
});

searchForm.addEventListener('submit', (e) => {
        searchProduct(searchInput);
        e.preventDefault();//evita recarga de pagina
}, false);

const searchProduct = (searchInput) => {
        result = filterProducts(searchInput.value);

        if (result.length == 0) {
                if (!productNotFoundedAlert.classList.contains('show'))
                        productNotFoundedAlert.classList.toggle('show');//muestra cartel de no encontrado
        } else {
                if (nav__menu.classList.contains('show')) { //En dispositivo movil, cierra el menu del nav
                        nav__menu.classList.toggle('show');
                        btn__nav.classList.toggle('active');
                }
                if (productNotFoundedAlert.classList.contains('show'))//oculta el cartel de no encontrado, si estaba visible
                        productNotFoundedAlert.classList.toggle('show');
                
                productsInformationTitle.textContent=`Busqueda: ${searchInput.value}`;
                productsInformationResults.textContent=`${ result.length} Resultados`
                scrollTo(0,productsInformation.offsetTop - 50);
                setTimeout(() => {
                        loadContainerProducts(resul);
                }, 400);
        }
}
//Filtrar productos
const filterProducts = (parameter) => {
        resul = products.filter(product =>
                product.category.toLowerCase().includes(parameter.toLowerCase())
        )
        return resul;
}


navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        if(cartView.classList.contains('show'))
                cartView.classList.toggle('show')
        scrollTo(0,mainInformation.offsetTop - 50);
})


btnNavProductos.addEventListener('click',(e)=>{
        e.preventDefault();
        productsContainer.innerHTML = '';
        productsInformationTitle.textContent=`Descubrí nuestros productos`;
        productsInformationResults.textContent=``;
        loadRandomProductsToContainer(products);
        scrollTo(0,productsInformation.offsetTop - 50);
});
btnNavCarteras.addEventListener('click',(e)=>{
        e.preventDefault();
        let filter = filterProducts('Carteras');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Carteras`;
        productsInformationResults.textContent=`${ filter.length} Resultados`;
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnNavBolsos.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('Bolsos');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Bolsos`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});

btnNavCE.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('colección Europea');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: colección Europea`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});

btnNavVerTodos.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Todos los productos`;
        productsInformationResults.textContent=`${ products.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(products);
        }, 400)
});
btnFooterCarteras.addEventListener("click",(e)=>{
        e.preventDefault();
        let filter = filterProducts('Carteras');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Carteras`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterBolsos.addEventListener('click', (e)=>{
        e.preventDefault();
        let filter = filterProducts('Bolsos');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: Bolsos`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterCE.addEventListener('click', (e) => {
        e.preventDefault();
        let filter = filterProducts('colección Europea');
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Categoria: colección Europea`;
        productsInformationResults.textContent=`${ filter.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(filter);
        }, 400)
});
btnFooterVerTodos.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav__menu.classList.contains('show')) {
                nav__menu.classList.toggle('show');
                btn__nav.classList.toggle('active');
        }
        productsInformationTitle.textContent=`Todos los productos`;
        productsInformationResults.textContent=`${ products.length} Resultados`
        scrollTo(0,productsInformation.offsetTop - 50);
        setTimeout(() => {
                loadContainerProducts(products);
        }, 400)
});

const arrayLength = (array) => {
        let count = 0;
        array.forEach(product => {

                if (product)
                        count += product.units;
        });
        return count;
}


btn__nav.addEventListener('click', () => {
        nav__menu.classList.toggle('show');
        btn__nav.classList.toggle('active');
})

// ocultar la vista del carrito
const addEventShowCart = () => {
        //btn carrito abre o cierra la vista del carrito.
        const btnCart = document.getElementById('btnCartView');
        btnCart.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });

        //cierra vista del carrito
        cartView.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart')) {
                        cartView.classList.toggle('show');
                }
        });

        //cierra la vista
        const btnCloseCartView = document.querySelector('.cart__sideContainer__title');
        btnCloseCartView.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });

        //vista del carrito
        const btnCartViewResponsive = document.querySelector('#btnCartViewResponsive');
        btnCartViewResponsive.addEventListener('click', () => {
                cartView.classList.toggle('show');
        });
}
// Finishim
btnFinishBuy.addEventListener('click', ()=>{
        location.href='./form.html';
})