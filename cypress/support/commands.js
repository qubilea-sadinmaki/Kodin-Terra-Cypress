
import './index'
import * as sc from './shoppingcart'
/// <reference types="Cypress" />

//INIT COMMANDS
var SHOPPINGCART_CACHE

Cypress.Commands.add('initTest', (selector, locator) => {
        SHOPPINGCART_CACHE = new sc.ShoppingcartCache()
        SHOPPINGCART_CACHE.reset()
})

Cypress.Commands.add('initTests', (selector, locator) => {

})
//NAVIGATION COMMANDS
Cypress.Commands.add('gotoHomeAndVerify', (selector, locator) => {
    cy.visit(selector)  
    // cy.viewport('macbook-15') 
    cy.get('[alt="' + locator + '"]')
    cy.contains('Haluatko valita automaattisesti lähimmän myymälän?').should('be.visible')
    cy.contains('Ei, älä valitse lähintä myymälää').click()
})

Cypress.Commands.add('navigateToLocationAndVerify', (location, locator) => {
    const sel = '[data-segmentid=' + location + ']'
    cy.waitLoaderNotVisible()
    cy.get(sel).click()
    cy.contains(locator,{timeout:10000})
})

Cypress.Commands.add('navigateToLocationViaMenuAndVerify', (location, locator) => {
    cy.get('[class="select-store-link text-small"]').click()
    cy.navigateToLocationAndVerify(location, locator)
})

Cypress.Commands.add('clickMainNavbarBtn', (locator) => { 
    cy.get('[class="nav-link"]').contains(locator).invoke('attr', 'href').then(($url) => {
        cy.visit($url)
    })
})

Cypress.Commands.add('navigateCategories', (main_category, sub_category=null, subsub_category=null) => {
    cy.get('[class="nav-item h-100 text-nowrap dropdown"]')
    .contains(main_category).trigger('mouseover').then(($main) => {
        
        if(sub_category == null)
        {
            cy.wrap($main).click()
        }
        else
        {
           cy.waitLoaderNotVisible()
           cy.get('[role="menuitem"]').contains(sub_category).click()
           if(subsub_category != null)
           {
               cy.waitLoaderNotVisible()
               cy.get('[class="category-name font-size-lg"]').contains(subsub_category).click()  
           }
        }
    })
   })
   
Cypress.Commands.add('gotoShoppingcart', () => {
       cy.get('#widget_minishopcart').click()
       cy.get('#goToBuy')
    })
   
Cypress.Commands.add('gotoShoppingdesk', () => {
       cy.get('#shoppingCartZipCodeCheckInput').clear().type('00400')
       cy.get('#shoppingCartZipCodeCheckButton').click()
       cy.waitLoaderNotVisible()
    //    cy.get('.d-none > .btn-primary').click()
       cy.contains('Jatka kassalle').invoke('attr', 'href').then(($url) => {
        cy.visit($url)
    })
    })
//VERIFY COMMANDS
Cypress.Commands.add('verifyStoreLocationInfo', (locator) => {
    cy.get('[class="tab yhteystiedot"]').within(() => { 
    cy.get('[class="col-sm-8"]').
    contains(locator) } )  
})

Cypress.Commands.add('verifyListHasRightElementsAtBeginning', (elementSelector, textReference, shouldBeAtleastOne=false) => {

    let isNotReferenceFound = false
    let isElementTextReferenceText = false
    let passed = true

    cy.get(elementSelector,{timeout:10000}).each(($el, index, $list) => {
      if(index < 1 && $el.textContent != textReference && shouldBeAtleastOne)
      {
        passed = false
        return false
      } 

      isElementTextReferenceText = ($el.textContent == textReference)
      if(isElementTextReferenceText && isNotReferenceFound)
      {
        passed = false
        return false
      } 
      isNotReferenceFound = ($el.textContent != textReference)
    })
    .then(() => { expect(passed).to.have.be.true })
})

Cypress.Commands.add('verifyShoppingdesk', () => {
    cy.get('.order-2').find('article').as('products')
    cy.get('@products').its('length').then(($l) => {
        let arr = Array.from({length:$l},(v,k)=>k)

        cy.wrap(arr).each((index) => {
            cy.get('@products').eq(index).within(($element) => { 
                cy.contains(SHOPPINGCART_CACHE.getProduct(index).name)
                cy.contains(SHOPPINGCART_CACHE.getProduct(index).count + " " + SHOPPINGCART_CACHE.getProduct(index).unit)
                cy.contains(SHOPPINGCART_CACHE.getProduct(index).price)       
            }) 
        })    
    })

    cy.get('[class="total-sum"]').find('[class="price-container"]').then(wrapper =>
        {
        let wrapperTxt = wrapper.text()
        cy.expect( wrapperTxt ).to.include( SHOPPINGCART_CACHE.getCurrentSaldo(',') )
        }) 
   })

   Cypress.Commands.add('verifyDelivery', (chosen_delivery_method='Toimitus kotiin') => {
    let delivery_cost
    cy.waitLoaderNotVisible()
    cy.contains(chosen_delivery_method).click({force:true}).wait(3000)


    cy.contains(chosen_delivery_method).within(($element) => {
        cy.wrap($element).find('.col > .justify-content-between > :nth-child(2) > .row > .m-0')
        .invoke('text').then(($delivery_cost) => {
            delivery_cost = $delivery_cost 
        })
    })
    cy.get('#cart-shipping-charge-container > .price-container').invoke('text').then(($cost_on_bill) => {
        cy.expect(delivery_cost.replace(/\s/g, '')).to.include($cost_on_bill.replace(/\s/g, ''))
        SHOPPINGCART_CACHE.currentDeliveryCost = parseFloat(delivery_cost)
    }) 
    
    cy.get('.totalPrice').then(wrapper =>
        {
        let wrapperTxt = wrapper.text()
        cy.log('TotlaCost:' + wrapperTxt)
        SHOPPINGCART_CACHE.currentTotalCost = wrapperTxt.replace(/\s/g, '')
        }) 
})

   Cypress.Commands.add('verifyBilling', () => {

       cy.get('#firstNameBilling').clear().type('Matti')
       cy.get('#lastNameBilling').clear().type('Meikäläinen')
       cy.get('#phone1Billing').clear().type('0452345666')
       cy.get('#email1Billing').clear().type('matti.meikalainen@gmail.com')
       cy.get('#address1Billing').clear().type('Coronatie 20 C 20')
       cy.get('#zipCodeBilling').clear().type('00500')
       cy.get('#cityBilling').clear().type('Helsinki')
       cy.get('[value="VISA,ELECTRON,MASTERCARD"]').check({force:true})     
   })

Cypress.Commands.add('verifyCreditcardForm', () => {

    cy.get('#goToBuy').click()
    cy.get('[class="summaryLine paymentAmount"]', {timeout:10000}).eq(0)
    .find('.amountLine').find('.amountHolder').find('.amount').invoke('text').then(($txt) =>
    {
        cy.expect( $txt.replace(/\s/g, '') ).to.include( SHOPPINGCART_CACHE.currentTotalCost )
    })

    cy.get('#form_CREDITCARD')
    cy.get('[id="form_CREDITCARD:creditCardNumber0_label"]').type('1234123412341234')
    cy.get('[id="form_CREDITCARD:expirationDate0"]').type('12/25')
    cy.get('[id="form_CREDITCARD:cardVerificationCode00"]').type('123')
    cy.get('.continueButton').should('not.be.disabled')
    cy.get('.continueButton').click({force:true}).end()     
})

Cypress.Commands.add('verifyProductsCountOnShoppingcart', () => {
    cy.get('[class="d-flex align-items-center product mx-1 py-3"]')
    .should('have.length', SHOPPINGCART_CACHE.countOfProducts )
})

Cypress.Commands.add('verifyProductIsAdded', () => {
    cy.get('#MiniShopCartProductAddedWrapper', {timeout:10000}).then(wrapper =>
        {
        let wrapperTxt = wrapper.text()
        // cy.log("MiniShopCartProductAddedWrapper text:" + wrapperTxt )
        wrapperTxt = wrapperTxt.replace(/\s/g, '')
        cy.expect( wrapperTxt ).to.include( SHOPPINGCART_CACHE.lastProduct.name.replace(/\s/g, '') )
        cy.expect( wrapperTxt ).to.include(SHOPPINGCART_CACHE.lastProduct.count + SHOPPINGCART_CACHE.lastProduct.unit)
        cy.expect( wrapperTxt ).to.include( SHOPPINGCART_CACHE.lastProduct.price.replace(/\s/g, '') )
        })  
})

Cypress.Commands.add('verifyShoppingcartIsUpdated', () => {
    cy.get('#widget_minishopcart').then(wrapper =>
        {
        let wrapperTxt = wrapper.text()
        wrapperTxt = wrapperTxt.replace(/\s/g, '')
        cy.expect( wrapperTxt ).to.include( SHOPPINGCART_CACHE.lastProduct.price.replace(/\s/g, '') )
        })  
})

//ADD AND REMOVE PRODUCTS COMMANDS
Cypress.Commands.add('addProducts', (product,count) => {
    cy.addProductToCache(product,count,false)
    cy.get('[title="' + product + '"]').filter('.img-responsive').click()
    cy.get('.productTitle').contains(product)
    cy.get('.d-sm-block > .shopperActions > .form-inline > div > #quantityProductPage').clear().type(count)
    cy.get('.d-sm-block > .shopperActions > .form-inline > #add2CartBtn').click() 
    cy.verifyProductIsAdded()
})

Cypress.Commands.add('addProduct', (product) => {
    cy.addProductToCache(product,1,true)
    cy.verifyProductIsAdded()
})

Cypress.Commands.add('addProductToCache', (product,count,buyIt) => {
    let price
    let unit
    cy.get('.product_listing_container').contains(product).parents('[class="details"]').as('product_cache')
    
    cy.get('@product_cache').within(() => {
 
        cy.get('.price').find('[class="special-price"]').invoke('attr', 'data-price').then(($data_price) =>
        {
            price = $data_price  
        })

        cy.get('.unit').then(($unit) =>
        {
            unit = $unit.text()  
            SHOPPINGCART_CACHE.addProductToList(product, price, count, unit)   
        }) 
    })

    if(buyIt)
    {
        cy.get('.product_listing_container').contains(product).parents('[class="details"]')
        .find('.online-availability > .btn').click() 
    } 
})

Cypress.Commands.add('addProductsToShoppingcart', (product,count=1) => {
    cy.waitLoaderNotVisible()

    if(count == 1)
    {
        cy.addProduct(product)
    }
    else
    {
        cy.addProducts(product,count)
    }
})

Cypress.Commands.add('searchAndAddProduct', (product,count=1) => {
    cy.get('[id="SimpleSearchForm_SearchTerm"]').clear().type(product + '{enter}') //
    cy.addProductsToShoppingcart(product, count)
})

Cypress.Commands.add('removeProductsFromShoppingcart', () => {
    cy.get('[class="d-none d-sm-inline-block font-icon font-icon-close font-icon-before mr-1"]').its('length').then(($l) => {
        let arr = Array.from({length:$l},(v,k)=>k)
        cy.wrap(arr).each((index) => {
            cy.get('[class="d-none d-sm-inline-block font-icon font-icon-close font-icon-before mr-1"]')
            .last().click({force:true}).wait(5000)
        })
    })
})

//OTHERCOMMANDS
Cypress.Commands.add('waitLoaderNotVisible', (product,count=1) => {
    cy.get('.spinner',{timeout:20000}).should('not.be.visible')
})

Cypress.Commands.add('hideCookie', (selector) => {
    cy.getCookies().then(($cookies) =>{
      //   cy.log('$cookies' + $cookies)
      //   for(let i=0;i < $cookies.length; i++)
      //   {
      //     cy.log($cookies[i]) 
      //   }
    })
      // cy.get('[class="light-button accept"]').then(($btn) => {
      //     $btn.click()
      // })     
      // .click() //hide cookie bar 
  })

















