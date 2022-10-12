import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CommandeComponentsPage, CommandeDeleteDialog, CommandeUpdatePage } from './commande.page-object';

const expect = chai.expect;

describe('Commande e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let commandeComponentsPage: CommandeComponentsPage;
  let commandeUpdatePage: CommandeUpdatePage;
  let commandeDeleteDialog: CommandeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Commandes', async () => {
    await navBarPage.goToEntity('commande');
    commandeComponentsPage = new CommandeComponentsPage();
    await browser.wait(ec.visibilityOf(commandeComponentsPage.title), 5000);
    expect(await commandeComponentsPage.getTitle()).to.eq('pizzaMarioApplicationApp.commande.home.title');
    await browser.wait(ec.or(ec.visibilityOf(commandeComponentsPage.entities), ec.visibilityOf(commandeComponentsPage.noResult)), 1000);
  });

  it('should load create Commande page', async () => {
    await commandeComponentsPage.clickOnCreateButton();
    commandeUpdatePage = new CommandeUpdatePage();
    expect(await commandeUpdatePage.getPageTitle()).to.eq('pizzaMarioApplicationApp.commande.home.createOrEditLabel');
    await commandeUpdatePage.cancel();
  });

  it('should create and save Commandes', async () => {
    const nbButtonsBeforeCreate = await commandeComponentsPage.countDeleteButtons();

    await commandeComponentsPage.clickOnCreateButton();

    await promise.all([
      commandeUpdatePage.getEstAEmporterInput().click(),
      commandeUpdatePage.setDateHeureCreationInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      commandeUpdatePage.setDateHeureLivraisonInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      commandeUpdatePage.clientSelectLastOption(),
    ]);

    await commandeUpdatePage.save();
    expect(await commandeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await commandeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Commande', async () => {
    const nbButtonsBeforeDelete = await commandeComponentsPage.countDeleteButtons();
    await commandeComponentsPage.clickOnLastDeleteButton();

    commandeDeleteDialog = new CommandeDeleteDialog();
    expect(await commandeDeleteDialog.getDialogTitle()).to.eq('pizzaMarioApplicationApp.commande.delete.question');
    await commandeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(commandeComponentsPage.title), 5000);

    expect(await commandeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
