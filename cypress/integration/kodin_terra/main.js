/// <reference types="Cypress" />

// These are test for Kodin Terra online shop. We are testing various things like, changing sore location,
// searching and buing products, verifying shopcart and testing UI. Tests related to product buying, searching etc.
// are made its easy to change products. All test are made by their names. Product names are in the kodin_terra.json

describe('Kodin Terra tests', function() {

    it('Verify Homepage and chosen location', function() {
        cy.gotoHomeAndVerify('fi/terra', 'Kodin Terra verkkokauppa - Etusivu')
        cy.navigateToLocationViaMenuAndVerify("Hameenlinna",'Kodin Terra Hämeenlinna')
        })

    it('Verify Store Change', function() {
        cy.gotoHomeAndVerify('fi/terra', 'Kodin Terra verkkokauppa - Etusivu')
        cy.navigateToLocationViaMenuAndVerify("Hameenlinna",'Kodin Terra Hämeenlinna')
        cy.clickMainNavbarBtn('Myymälä')
        cy.verifyStoreLocationInfo("Hämeenlinna")
        cy.navigateToLocationViaMenuAndVerify("Pori",'Kodin Terra Pori')
        cy.verifyStoreLocationInfo("Pori")
        })

    it('Verify Search', function() {
        cy.gotoHomeAndVerify('fi/terra', 'Kodin Terra verkkokauppa - Etusivu')
        cy.navigateToLocationViaMenuAndVerify("Hameenlinna",'Kodin Terra Hämeenlinna')
        cy.get('[id="SimpleSearchForm_SearchTerm"]').type('Weber')
        cy.verifyListHasRightElementsAtBeginning('[class="autosuggestHeader"]', 'Osasto')
        cy.get('[id="SimpleSearchForm_SearchTerm"]').clear()     
        cy.get('[id="SimpleSearchForm_SearchTerm"]').type('Fiskars')
        cy.verifyListHasRightElementsAtBeginning('[class="autosuggestHeader"]', 'Brändi')
        })

    it('Verify Shoppingcart', function() {
        cy.gotoHomeAndVerify('fi/terra', 'Kodin Terra verkkokauppa - Etusivu')
        cy.navigateToLocationViaMenuAndVerify("Hameenlinna",'Kodin Terra Hämeenlinna')
        cy.get('[id="SimpleSearchForm_SearchTerm"]').type('Weber')
        cy.get('[class="category_list"]').contains('PuutarhaGrillausWeber grillit').click()
        cy.get('#PageHeading_1_-2001_1989').contains('Weber grillit')
        cy.addProductsToShoppingcart(this.DATA.products[5].name, 2)
        }) 

    it('Verify Shoppingcart Contents', function() {
        cy.gotoHomeAndVerify('fi/terra', 'Kodin Terra verkkokauppa - Etusivu')
        cy.navigateToLocationViaMenuAndVerify("Hameenlinna",'Kodin Terra Hämeenlinna')

        cy.get('#widget_minishopcart').click()
        cy.get('#main').contains('Ostoskori on tyhjä.')

        cy.searchAndAddProduct(this.DATA.products[0].name)
        cy.searchAndAddProduct(this.DATA.products[1].name,2)
        cy.searchAndAddProduct(this.DATA.products[2].name)
        cy.searchAndAddProduct(this.DATA.products[3].name,5)
        cy.searchAndAddProduct(this.DATA.products[4].name)

        cy.get('#widget_minishopcart').click()
        cy.verifyProductsCountOnShoppingcart()
        cy.removeProductsFromShoppingcart()
        }) 

    it('Verify Product Categories', function() {
        cy.gotoHomeAndVerify('fi/terra', 'Kodin Terra verkkokauppa - Etusivu')
        cy.navigateToLocationViaMenuAndVerify("Hameenlinna",'Kodin Terra Hämeenlinna')
        cy.navigateCategories('Työkalut ja -koneet', 'Vasarat ja lekat')
        cy.addProductsToShoppingcart(this.DATA.products[7].name)
        cy.verifyShoppingcartIsUpdated()
        cy.navigateCategories('Rakentaminen', 'Naulat, naulauslevyt ja palkkikengät','Naulat')
        cy.addProductsToShoppingcart(this.DATA.products[8].name)
        cy.gotoShoppingcart()
        cy.gotoShoppingdesk()   
        cy.verifyShoppingdesk()
        cy.verifyDelivery()
        cy.verifyBilling()
        cy.verifyCreditcardForm()
        }) 

        // before/after testcase or testsuite
        
        before(function() {
            
        })
      
        after(function() {
          // runs once after all tests in the block
        })
      
        beforeEach(function() {
            
            cy.fixture('kodin_terra').as('DATA') 
            cy.hideCookie()
            cy.initTest()
        })
      
        afterEach(function() {
          // runs after each test in the block
        })
  })

