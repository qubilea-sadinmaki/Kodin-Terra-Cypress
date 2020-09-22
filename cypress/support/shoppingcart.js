/// <reference types="Cypress" />

class ShoppingcartCache
{
    saldo = 0
    deliveryCost = 0
    totalCost = 0
    products = []

    constructor()
    {

    }

    getProduct(index)
    {
        return this.products[index]
    }

    get lastProduct()
    {
        return this.products[this.products.length-1]
    }

    get countOfProducts()
    {
        return this.products.length
    }

    getCurrentSaldo(withSeparator='')
    {
        let retVal = this.saldo.toFixed(2)
        if(withSeparator != '') return retVal.replace(".", withSeparator)
        else return retVal      
    }

    get currentSaldo()
    {
        return this.saldo.toFixed(2)
    }

    get currentTotalSaldo()
    {
        return this.saldo + this.deliveryCost
    }

    set currentTotalCost(val)
    {
        this.totalCost = val
    }  
    
    get currentTotalCost()
    {
        return this.totalCost
    }  

    get currentDeliveryCost()
    {
        return this.deliveryCost
    }

    set currentDeliveryCost(val)
    {
        this.deliveryCost = val
    }

    reset()
    {
     this.products = []
     this.saldo = 0
    }

    addProductToList(product, price, count, unit)
    {
        this.products.push(this.newProduct(product, price, count, unit))
        price = parseFloat(price.replace( ",", ".") )
        this.saldo += parseInt(count) * price.toFixed(2)
        cy.log('product:' + product + ' price:' + price +  '-count:' +count+ '-unit:' + unit + '-saldo:' + this.saldo)
    }

    newProduct(pname="NoName", pprice=0, pcount=0, punit)
    {
        if(punit == null || punit == "") punit='kpl'
        return {name:pname, price:pprice, count:pcount, unit:punit}
    }
}
export {ShoppingcartCache}; 