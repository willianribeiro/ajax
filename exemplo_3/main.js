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
 */
(function () {
    'use strict'

    const api = Api()
    let productsInBlackFriday;

    api.getCurrentUser()
        .then(user => user.json())
        .then(user => {
            console.log('user: ', user)

            api.getWishlist(user.id)
                .then(wishlist => wishlist.json())
                .then(wishlist => {
                    console.log('wishlist: ', wishlist)
    
                    api.listBlackFridayProducts()
                        .then(blackFriday => blackFriday.json())
                        .then(blackFriday => {
                            console.log('black friday: ', blackFriday)
        
                            productsInBlackFriday = wishlist.filter(wishlistId => {
                                return blackFriday.some(blackFridayId => blackFridayId === wishlistId)
                            })
            
                            console.log('Produtos da wishlist na blackFriday: ', productsInBlackFriday)
            
                            const promises = [];
                            productsInBlackFriday.forEach(productId => {
                                promises.push(api.getProduct(productId))
                            })
            
                            Promise.all(promises)
                                .then(products => Promise.all(products.map(product => product.json())))
                                .then(products => {
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
                                })
                        })
                })
        })
        
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

    function getCurrentUser() {
        return fetch('./data/user.json')
    }

    function getWishlist(userId) {
        return fetch('./data/wishlist.json')
    }
    
    function listBlackFridayProducts() {
        return fetch('./data/black_friday.json')
    }
    
    function listProducts() {
        return fetch('./data/products.json')
    }
    
    function getProduct(id) {
        return fetch('./data/product${id}.json'.replace('${id}', id))
    }

    return api;
}