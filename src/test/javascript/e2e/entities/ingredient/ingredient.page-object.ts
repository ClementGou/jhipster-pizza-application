import { element, by, ElementFinder } from 'protractor';

export class IngredientComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-ingredient div table .btn-danger'));
  title = element.all(by.css('jhi-ingredient div h2#page-heading span')).first();
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

export class IngredientUpdatePage {
  pageTitle = element(by.id('jhi-ingredient-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nomInput = element(by.id('field_nom'));
  quantiteInput = element(by.id('field_quantite'));
  prixInput = element(by.id('field_prix'));

  pizzaSelect = element(by.id('field_pizza'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNomInput(nom: string): Promise<void> {
    await this.nomInput.sendKeys(nom);
  }

  async getNomInput(): Promise<string> {
    return await this.nomInput.getAttribute('value');
  }

  async setQuantiteInput(quantite: string): Promise<void> {
    await this.quantiteInput.sendKeys(quantite);
  }

  async getQuantiteInput(): Promise<string> {
    return await this.quantiteInput.getAttribute('value');
  }

  async setPrixInput(prix: string): Promise<void> {
    await this.prixInput.sendKeys(prix);
  }

  async getPrixInput(): Promise<string> {
    return await this.prixInput.getAttribute('value');
  }

  async pizzaSelectLastOption(): Promise<void> {
    await this.pizzaSelect.all(by.tagName('option')).last().click();
  }

  async pizzaSelectOption(option: string): Promise<void> {
    await this.pizzaSelect.sendKeys(option);
  }

  getPizzaSelect(): ElementFinder {
    return this.pizzaSelect;
  }

  async getPizzaSelectedOption(): Promise<string> {
    return await this.pizzaSelect.element(by.css('option:checked')).getText();
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

export class IngredientDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-ingredient-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-ingredient'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
