package fr.clem.pizza.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.clem.pizza.IntegrationTest;
import fr.clem.pizza.domain.Pizza;
import fr.clem.pizza.repository.PizzaRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PizzaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PizzaResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final Double DEFAULT_PRIX = 1D;
    private static final Double UPDATED_PRIX = 2D;

    private static final String ENTITY_API_URL = "/api/pizzas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PizzaRepository pizzaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPizzaMockMvc;

    private Pizza pizza;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pizza createEntity(EntityManager em) {
        Pizza pizza = new Pizza().nom(DEFAULT_NOM).prix(DEFAULT_PRIX);
        return pizza;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pizza createUpdatedEntity(EntityManager em) {
        Pizza pizza = new Pizza().nom(UPDATED_NOM).prix(UPDATED_PRIX);
        return pizza;
    }

    @BeforeEach
    public void initTest() {
        pizza = createEntity(em);
    }

    @Test
    @Transactional
    void createPizza() throws Exception {
        int databaseSizeBeforeCreate = pizzaRepository.findAll().size();
        // Create the Pizza
        restPizzaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pizza)))
            .andExpect(status().isCreated());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeCreate + 1);
        Pizza testPizza = pizzaList.get(pizzaList.size() - 1);
        assertThat(testPizza.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPizza.getPrix()).isEqualTo(DEFAULT_PRIX);
    }

    @Test
    @Transactional
    void createPizzaWithExistingId() throws Exception {
        // Create the Pizza with an existing ID
        pizza.setId(1L);

        int databaseSizeBeforeCreate = pizzaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPizzaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pizza)))
            .andExpect(status().isBadRequest());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPizzas() throws Exception {
        // Initialize the database
        pizzaRepository.saveAndFlush(pizza);

        // Get all the pizzaList
        restPizzaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pizza.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prix").value(hasItem(DEFAULT_PRIX.doubleValue())));
    }

    @Test
    @Transactional
    void getPizza() throws Exception {
        // Initialize the database
        pizzaRepository.saveAndFlush(pizza);

        // Get the pizza
        restPizzaMockMvc
            .perform(get(ENTITY_API_URL_ID, pizza.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pizza.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prix").value(DEFAULT_PRIX.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingPizza() throws Exception {
        // Get the pizza
        restPizzaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPizza() throws Exception {
        // Initialize the database
        pizzaRepository.saveAndFlush(pizza);

        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();

        // Update the pizza
        Pizza updatedPizza = pizzaRepository.findById(pizza.getId()).get();
        // Disconnect from session so that the updates on updatedPizza are not directly saved in db
        em.detach(updatedPizza);
        updatedPizza.nom(UPDATED_NOM).prix(UPDATED_PRIX);

        restPizzaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPizza.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPizza))
            )
            .andExpect(status().isOk());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
        Pizza testPizza = pizzaList.get(pizzaList.size() - 1);
        assertThat(testPizza.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPizza.getPrix()).isEqualTo(UPDATED_PRIX);
    }

    @Test
    @Transactional
    void putNonExistingPizza() throws Exception {
        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();
        pizza.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPizzaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pizza.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pizza))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPizza() throws Exception {
        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();
        pizza.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPizzaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pizza))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPizza() throws Exception {
        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();
        pizza.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPizzaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pizza)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePizzaWithPatch() throws Exception {
        // Initialize the database
        pizzaRepository.saveAndFlush(pizza);

        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();

        // Update the pizza using partial update
        Pizza partialUpdatedPizza = new Pizza();
        partialUpdatedPizza.setId(pizza.getId());

        partialUpdatedPizza.nom(UPDATED_NOM);

        restPizzaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPizza.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPizza))
            )
            .andExpect(status().isOk());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
        Pizza testPizza = pizzaList.get(pizzaList.size() - 1);
        assertThat(testPizza.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPizza.getPrix()).isEqualTo(DEFAULT_PRIX);
    }

    @Test
    @Transactional
    void fullUpdatePizzaWithPatch() throws Exception {
        // Initialize the database
        pizzaRepository.saveAndFlush(pizza);

        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();

        // Update the pizza using partial update
        Pizza partialUpdatedPizza = new Pizza();
        partialUpdatedPizza.setId(pizza.getId());

        partialUpdatedPizza.nom(UPDATED_NOM).prix(UPDATED_PRIX);

        restPizzaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPizza.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPizza))
            )
            .andExpect(status().isOk());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
        Pizza testPizza = pizzaList.get(pizzaList.size() - 1);
        assertThat(testPizza.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPizza.getPrix()).isEqualTo(UPDATED_PRIX);
    }

    @Test
    @Transactional
    void patchNonExistingPizza() throws Exception {
        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();
        pizza.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPizzaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pizza.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pizza))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPizza() throws Exception {
        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();
        pizza.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPizzaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pizza))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPizza() throws Exception {
        int databaseSizeBeforeUpdate = pizzaRepository.findAll().size();
        pizza.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPizzaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pizza)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pizza in the database
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePizza() throws Exception {
        // Initialize the database
        pizzaRepository.saveAndFlush(pizza);

        int databaseSizeBeforeDelete = pizzaRepository.findAll().size();

        // Delete the pizza
        restPizzaMockMvc
            .perform(delete(ENTITY_API_URL_ID, pizza.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pizza> pizzaList = pizzaRepository.findAll();
        assertThat(pizzaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
