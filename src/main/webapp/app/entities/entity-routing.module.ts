import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'pizza',
        data: { pageTitle: 'pizzaMarioApplicationApp.pizza.home.title' },
        loadChildren: () => import('./pizza/pizza.module').then(m => m.PizzaModule),
      },
      {
        path: 'ingredient',
        data: { pageTitle: 'pizzaMarioApplicationApp.ingredient.home.title' },
        loadChildren: () => import('./ingredient/ingredient.module').then(m => m.IngredientModule),
      },
      {
        path: 'client',
        data: { pageTitle: 'pizzaMarioApplicationApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'commande',
        data: { pageTitle: 'pizzaMarioApplicationApp.commande.home.title' },
        loadChildren: () => import('./commande/commande.module').then(m => m.CommandeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
