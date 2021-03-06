/**
 * # Problema:
 * 
 * 1. Buscar usuário logado
 * 2. Buscar wishlist do usuário logado
 * 3. Buscar os produtos que estão na black friday
 * 4. Filtrar a wishlist do usuário pelos produtos que estão na black friday.
 * 5. Buscar cada produto da wishlist filtrada
 * 6. Calcular o valor final de cada produto e adicionar ao objeto produto
 * 
 * 
 * # Documentação Api:
 * 
 *      Api.getCurrentUser(): retorna um objeto User 
 *      Api.getWishlist(userId: number): retorna uma lista de id's (id do produto) 
 *      Api.listBlackFridayProducts(): retorna uma lista de id's (id do produto)
 *      Api.listProducts(): retorna uma lista de objetos Product
 *      Api.getProduct(id: number): retorna um objeto Product
 * 
 * 
 * # Documentação dos objetos:
 * 
 *      Product:
 *      {
 *          "id": number,
 *          "name": string,
 *          "value": number (decimal)
 *          "discount": number (de 0 a 100 - representa um percentual)
 *      }
 * 
 *      User:
 *      {
 *          "id": 0,
 *          "name": "Machado de Assis",
 *          "username": "machado",
 *          "email": "machado@assis.com.br"}
 *      }
 * 
 * # Solução
 * 
 * (exemplo_2 encadeando promises com then)
 */
(function () {
    'use strict'

    const getCurrentUserSuccess = api => user => {
        console.log('user: ', user)
        return api.getWishlist(user.id)
    }

    const getWishlistSuccess = api => wishlist => {
        console.log('wishlist: ', wishlist)
        
        const promise = new Promise((resolve, request) => {
            api.listBlackFridayProducts()
                .then(blackFriday => resolve({ blackFriday, wishlist }));
        });

        return promise;
    }
    
    const listBlackFridayProductsSuccess = api => ({ blackFriday, wishlist }) => {
        console.log('black friday: ', blackFriday)

        const productsInBlackFriday = wishlist.filter(wishlistId => {
            return blackFriday.some(blackFridayId => blackFridayId === wishlistId)
        })

        console.log('Produtos da wishlist na blackFriday: ', productsInBlackFriday)

        const promises = [];
        productsInBlackFriday.forEach(productId => {
            promises.push(api.getProduct(productId))
        })

        return Promise.all(promises);
    }

    const returnService = api => products => {
        const userWishlist = products.map(product => {
            const finalValue = product.value - (product.value * product.discount / 100)

            return {
                id: product.id,
                name: product.name,
                value: product.value,
                discount: product.discount,
                finalValue: finalValue
            }
        })

        console.log('userWishlist: ', userWishlist)
    }

    const api = Api()

    api.getCurrentUser()
        .then(getCurrentUserSuccess(api))
        .then(getWishlistSuccess(api))
        .then(listBlackFridayProductsSuccess(api))
        .then(returnService(api));
})()


function Api () {
    'use strict'

    const api = {
        getCurrentUser: getCurrentUser,
        getWishlist: getWishlist,
        listBlackFridayProducts: listBlackFridayProducts,
        listProducts: listProducts,
        getProduct: getProduct,
    }

    // private functions
    function _isRequestSucceeded(ajax) {
        return ajax.status === 200 && ajax.readyState === 4
    }

    function _createRequest(method, url) {
        return (resolve, request) => {
            const ajax = new XMLHttpRequest()
            ajax.open(method, url)
            ajax.addEventListener('readystatechange', () => {
                if (_isRequestSucceeded(ajax))
                    try {
                        const response = JSON.parse(ajax.response)
                        resolve(response)
                    } catch(error) {
                        console.error(error)
                    }
            })
            ajax.send()
        }
    }

    // public functions
    function getCurrentUser() {
        const request = _createRequest('GET', './data/user.json')
        const promise = new Promise(request)
        return promise
    }

    function getWishlist(userId) {
        const request = _createRequest('GET', './data/wishlist.json')
        const promise = new Promise(request)
        return promise
    }

    function listBlackFridayProducts() {
        const request = _createRequest('GET', './data/black_friday.json')
        const promise = new Promise(request)
        return promise
    }

    function listProducts() {
        const request = _createRequest('GET', './data/products.json')
        const promise = new Promise(request)
        return promise
    }

    function getProduct(id) {
        const request = _createRequest('GET', './data/product${id}.json'.replace('${id}', id))
        const promise = new Promise(request)
        return promise
    }

    return api;
}