package fr.clem.pizza.web.rest;

import fr.clem.pizza.domain.Pizza;
import fr.clem.pizza.repository.PizzaRepository;
import fr.clem.pizza.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.clem.pizza.domain.Pizza}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PizzaResource {

    private final Logger log = LoggerFactory.getLogger(PizzaResource.class);

    private static final String ENTITY_NAME = "pizza";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PizzaRepository pizzaRepository;

    public PizzaResource(PizzaRepository pizzaRepository) {
        this.pizzaRepository = pizzaRepository;
    }

    /**
     * {@code POST  /pizzas} : Create a new pizza.
     *
     * @param pizza the pizza to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pizza, or with status {@code 400 (Bad Request)} if the pizza has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pizzas")
    public ResponseEntity<Pizza> createPizza(@RequestBody Pizza pizza) throws URISyntaxException {
        log.debug("REST request to save Pizza : {}", pizza);
        if (pizza.getId() != null) {
            throw new BadRequestAlertException("A new pizza cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pizza result = pizzaRepository.save(pizza);
        return ResponseEntity
            .created(new URI("/api/pizzas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pizzas/:id} : Updates an existing pizza.
     *
     * @param id the id of the pizza to save.
     * @param pizza the pizza to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pizza,
     * or with status {@code 400 (Bad Request)} if the pizza is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pizza couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pizzas/{id}")
    public ResponseEntity<Pizza> updatePizza(@PathVariable(value = "id", required = false) final Long id, @RequestBody Pizza pizza)
        throws URISyntaxException {
        log.debug("REST request to update Pizza : {}, {}", id, pizza);
        if (pizza.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pizza.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pizzaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Pizza result = pizzaRepository.save(pizza);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pizza.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pizzas/:id} : Partial updates given fields of an existing pizza, field will ignore if it is null
     *
     * @param id the id of the pizza to save.
     * @param pizza the pizza to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pizza,
     * or with status {@code 400 (Bad Request)} if the pizza is not valid,
     * or with status {@code 404 (Not Found)} if the pizza is not found,
     * or with status {@code 500 (Internal Server Error)} if the pizza couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pizzas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pizza> partialUpdatePizza(@PathVariable(value = "id", required = false) final Long id, @RequestBody Pizza pizza)
        throws URISyntaxException {
        log.debug("REST request to partial update Pizza partially : {}, {}", id, pizza);
        if (pizza.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pizza.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pizzaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pizza> result = pizzaRepository
            .findById(pizza.getId())
            .map(existingPizza -> {
                if (pizza.getNom() != null) {
                    existingPizza.setNom(pizza.getNom());
                }
                if (pizza.getPrix() != null) {
                    existingPizza.setPrix(pizza.getPrix());
                }

                return existingPizza;
            })
            .map(pizzaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pizza.getId().toString())
        );
    }

    /**
     * {@code GET  /pizzas} : get all the pizzas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pizzas in body.
     */
    @GetMapping("/pizzas")
    public List<Pizza> getAllPizzas() {
        log.debug("REST request to get all Pizzas");
        return pizzaRepository.findAll();
    }

    /**
     * {@code GET  /pizzas/:id} : get the "id" pizza.
     *
     * @param id the id of the pizza to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pizza, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pizzas/{id}")
    public ResponseEntity<Pizza> getPizza(@PathVariable Long id) {
        log.debug("REST request to get Pizza : {}", id);
        Optional<Pizza> pizza = pizzaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pizza);
    }

    /**
     * {@code DELETE  /pizzas/:id} : delete the "id" pizza.
     *
     * @param id the id of the pizza to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pizzas/{id}")
    public ResponseEntity<Void> deletePizza(@PathVariable Long id) {
        log.debug("REST request to delete Pizza : {}", id);
        pizzaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
