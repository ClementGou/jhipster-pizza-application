import { element, by, ElementFinder } from 'protractor';

export class CommandeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-commande div table .btn-danger'));
  title = element.all(by.css('jhi-commande div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class CommandeUpdatePage {
  pageTitle = element(by.id('jhi-commande-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  estAEmporterInput = element(by.id('field_estAEmporter'));
  dateHeureCreationInput = element(by.id('field_dateHeureCreation'));
  dateHeureLivraisonInput = element(by.id('field_dateHeureLivraison'));

  clientSelect = element(by.id('field_client'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  getEstAEmporterInput(): ElementFinder {
    return this.estAEmporterInput;
  }

  async setDateHeureCreationInput(dateHeureCreation: string): Promise<void> {
    await this.dateHeureCreationInput.sendKeys(dateHeureCreation);
  }

  async getDateHeureCreationInput(): Promise<string> {
    return await this.dateHeureCreationInput.getAttribute('value');
  }

  async setDateHeureLivraisonInput(dateHeureLivraison: string): Promise<void> {
    await this.dateHeureLivraisonInput.sendKeys(dateHeureLivraison);
  }

  async getDateHeureLivraisonInput(): Promise<string> {
    return await this.dateHeureLivraisonInput.getAttribute('value');
  }

  async clientSelectLastOption(): Promise<void> {
    await this.clientSelect.all(by.tagName('option')).last().click();
  }

  async clientSelectOption(option: string): Promise<void> {
    await this.clientSelect.sendKeys(option);
  }

  getClientSelect(): ElementFinder {
    return this.clientSelect;
  }

  async getClientSelectedOption(): Promise<string> {
    return await this.clientSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class CommandeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-commande-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-commande'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
