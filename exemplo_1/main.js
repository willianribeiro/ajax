/**
 * # Problema:
 * 
 * 1. Buscar usuário logado
 * 2. Buscar wishlist do usuário logado
 * 3. Buscar os produtos que estão na black friday
 * 4. Filtrar a wishlist do usuário pelos produtos que estão na black friday.
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
 */
(function() {
    'use strict'

    const api = Api()
    let productsInBlackFriday;

    api.getCurrentUser().then(user => {
        console.log('user: ', user)

        api.getWishlist(user.id).then(wishlist => {
            console.log('wishlist: ', wishlist)

            api.listBlackFridayProducts().then(blackFriday => {
                console.log('black friday: ', blackFriday)

                productsInBlackFriday =  wishlist.filter(wishlistId => {
                    return blackFriday.some(blackFridayId => blackFridayId === wishlistId)
                })

                console.log('Produtos da wishlist na blackFriday: ', productsInBlackFriday)
            })
        })
    })
})()


function Api () {
    'use strict'

    var api = {
        getCurrentUser: getCurrentUser,
        getWishlist: getWishlist,
        listBlackFridayProducts: listBlackFridayProducts,
        listProducts: listProducts,
        getProduct: getProduct,
    }

    function _isRequestSucceeded(ajax) {
        return ajax.status === 200 && ajax.readyState === 4
    }

    function getCurrentUser() {
        const request = (resolve, reject) => {
            var ajax = new XMLHttpRequest()
            ajax.open('GET', './data/user.json')
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

        return new Promise(request)
    }
    
    function getWishlist(userId) {
        const request = (resolve, reject) => {
            var ajax = new XMLHttpRequest()
            ajax.open('GET', './data/wishlist.json')
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

        return new Promise(request)
    }

    function listBlackFridayProducts() {
        const request = (resolve, reject) => {
            var ajax = new XMLHttpRequest()
            ajax.open('GET', './data/black_friday.json')
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

        return new Promise(request)
    }

    function listProducts() {
        const request = (resolve, reject) => {
            var ajax = new XMLHttpRequest()
            ajax.open('GET', './data/products.json')
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

        return new Promise(request)
    }
    
    function getProduct(id) {
        const request = (resolve, reject) => {
            var ajax = new XMLHttpRequest()
            var url = './data/product${id}.json'.replace('${id}', id)
            ajax.open('GET', url)
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

        return new Promise(request)
    }

    return api;
}