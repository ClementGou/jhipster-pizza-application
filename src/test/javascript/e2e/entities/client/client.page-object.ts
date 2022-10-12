import { element, by, ElementFinder } from 'protractor';

export class ClientComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-client div table .btn-danger'));
  title = element.all(by.css('jhi-client div h2#page-heading span')).first();
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

export class ClientUpdatePage {
  pageTitle = element(by.id('jhi-client-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nomInput = element(by.id('field_nom'));
  numeroTelephoneInput = element(by.id('field_numeroTelephone'));
  emailInput = element(by.id('field_email'));

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

  async setNumeroTelephoneInput(numeroTelephone: string): Promise<void> {
    await this.numeroTelephoneInput.sendKeys(numeroTelephone);
  }

  async getNumeroTelephoneInput(): Promise<string> {
    return await this.numeroTelephoneInput.getAttribute('value');
  }

  async setEmailInput(email: string): Promise<void> {
    await this.emailInput.sendKeys(email);
  }

  async getEmailInput(): Promise<string> {
    return await this.emailInput.getAttribute('value');
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

export class ClientDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-client-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-client'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
