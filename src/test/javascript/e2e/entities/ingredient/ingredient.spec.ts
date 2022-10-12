import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { IngredientComponentsPage, IngredientDeleteDialog, IngredientUpdatePage } from './ingredient.page-object';

const expect = chai.expect;

describe('Ingredient e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ingredientComponentsPage: IngredientComponentsPage;
  let ingredientUpdatePage: IngredientUpdatePage;
  let ingredientDeleteDialog: IngredientDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Ingredients', async () => {
    await navBarPage.goToEntity('ingredient');
    ingredientComponentsPage = new IngredientComponentsPage();
    await browser.wait(ec.visibilityOf(ingredientComponentsPage.title), 5000);
    expect(await ingredientComponentsPage.getTitle()).to.eq('pizzaMarioApplicationApp.ingredient.home.title');
    await browser.wait(ec.or(ec.visibilityOf(ingredientComponentsPage.entities), ec.visibilityOf(ingredientComponentsPage.noResult)), 1000);
  });

  it('should load create Ingredient page', async () => {
    await ingredientComponentsPage.clickOnCreateButton();
    ingredientUpdatePage = new IngredientUpdatePage();
    expect(await ingredientUpdatePage.getPageTitle()).to.eq('pizzaMarioApplicationApp.ingredient.home.createOrEditLabel');
    await ingredientUpdatePage.cancel();
  });

  it('should create and save Ingredients', async () => {
    const nbButtonsBeforeCreate = await ingredientComponentsPage.countDeleteButtons();

    await ingredientComponentsPage.clickOnCreateButton();

    await promise.all([
      ingredientUpdatePage.setNomInput('nom'),
      ingredientUpdatePage.setQuantiteInput('5'),
      ingredientUpdatePage.setPrixInput('5'),
      ingredientUpdatePage.pizzaSelectLastOption(),
    ]);

    await ingredientUpdatePage.save();
    expect(await ingredientUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await ingredientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Ingredient', async () => {
    const nbButtonsBeforeDelete = await ingredientComponentsPage.countDeleteButtons();
    await ingredientComponentsPage.clickOnLastDeleteButton();

    ingredientDeleteDialog = new IngredientDeleteDialog();
    expect(await ingredientDeleteDialog.getDialogTitle()).to.eq('pizzaMarioApplicationApp.ingredient.delete.question');
    await ingredientDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(ingredientComponentsPage.title), 5000);

    expect(await ingredientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
