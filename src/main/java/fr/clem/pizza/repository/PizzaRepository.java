package fr.clem.pizza.repository;

import fr.clem.pizza.domain.Pizza;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Pizza entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PizzaRepository extends JpaRepository<Pizza, Long> {}
