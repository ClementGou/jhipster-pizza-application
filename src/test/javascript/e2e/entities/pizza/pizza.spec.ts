import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PizzaComponentsPage, PizzaDeleteDialog, PizzaUpdatePage } from './pizza.page-object';

const expect = chai.expect;

describe('Pizza e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pizzaComponentsPage: PizzaComponentsPage;
  let pizzaUpdatePage: PizzaUpdatePage;
  let pizzaDeleteDialog: PizzaDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Pizzas', async () => {
    await navBarPage.goToEntity('pizza');
    pizzaComponentsPage = new PizzaComponentsPage();
    await browser.wait(ec.visibilityOf(pizzaComponentsPage.title), 5000);
    expect(await pizzaComponentsPage.getTitle()).to.eq('pizzaMarioApplicationApp.pizza.home.title');
    await browser.wait(ec.or(ec.visibilityOf(pizzaComponentsPage.entities), ec.visibilityOf(pizzaComponentsPage.noResult)), 1000);
  });

  it('should load create Pizza page', async () => {
    await pizzaComponentsPage.clickOnCreateButton();
    pizzaUpdatePage = new PizzaUpdatePage();
    expect(await pizzaUpdatePage.getPageTitle()).to.eq('pizzaMarioApplicationApp.pizza.home.createOrEditLabel');
    await pizzaUpdatePage.cancel();
  });

  it('should create and save Pizzas', async () => {
    const nbButtonsBeforeCreate = await pizzaComponentsPage.countDeleteButtons();

    await pizzaComponentsPage.clickOnCreateButton();

    await promise.all([pizzaUpdatePage.setNomInput('nom'), pizzaUpdatePage.setPrixInput('5'), pizzaUpdatePage.commandesSelectLastOption()]);

    await pizzaUpdatePage.save();
    expect(await pizzaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pizzaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Pizza', async () => {
    const nbButtonsBeforeDelete = await pizzaComponentsPage.countDeleteButtons();
    await pizzaComponentsPage.clickOnLastDeleteButton();

    pizzaDeleteDialog = new PizzaDeleteDialog();
    expect(await pizzaDeleteDialog.getDialogTitle()).to.eq('pizzaMarioApplicationApp.pizza.delete.question');
    await pizzaDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(pizzaComponentsPage.title), 5000);

    expect(await pizzaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
