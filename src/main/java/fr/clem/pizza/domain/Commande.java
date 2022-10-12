package fr.clem.pizza.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Commande.
 */
@Entity
@Table(name = "commande")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Commande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "est_a_emporter")
    private Boolean estAEmporter;

    @Column(name = "date_heure_creation")
    private Instant dateHeureCreation;

    @Column(name = "date_heure_livraison")
    private Instant dateHeureLivraison;

    @OneToMany(mappedBy = "commandes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ingredients", "clients", "commandes" }, allowSetters = true)
    private Set<Pizza> pizzas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "pizza", "commandes" }, allowSetters = true)
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Commande id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getEstAEmporter() {
        return this.estAEmporter;
    }

    public Commande estAEmporter(Boolean estAEmporter) {
        this.setEstAEmporter(estAEmporter);
        return this;
    }

    public void setEstAEmporter(Boolean estAEmporter) {
        this.estAEmporter = estAEmporter;
    }

    public Instant getDateHeureCreation() {
        return this.dateHeureCreation;
    }

    public Commande dateHeureCreation(Instant dateHeureCreation) {
        this.setDateHeureCreation(dateHeureCreation);
        return this;
    }

    public void setDateHeureCreation(Instant dateHeureCreation) {
        this.dateHeureCreation = dateHeureCreation;
    }

    public Instant getDateHeureLivraison() {
        return this.dateHeureLivraison;
    }

    public Commande dateHeureLivraison(Instant dateHeureLivraison) {
        this.setDateHeureLivraison(dateHeureLivraison);
        return this;
    }

    public void setDateHeureLivraison(Instant dateHeureLivraison) {
        this.dateHeureLivraison = dateHeureLivraison;
    }

    public Set<Pizza> getPizzas() {
        return this.pizzas;
    }

    public void setPizzas(Set<Pizza> pizzas) {
        if (this.pizzas != null) {
            this.pizzas.forEach(i -> i.setCommandes(null));
        }
        if (pizzas != null) {
            pizzas.forEach(i -> i.setCommandes(this));
        }
        this.pizzas = pizzas;
    }

    public Commande pizzas(Set<Pizza> pizzas) {
        this.setPizzas(pizzas);
        return this;
    }

    public Commande addPizza(Pizza pizza) {
        this.pizzas.add(pizza);
        pizza.setCommandes(this);
        return this;
    }

    public Commande removePizza(Pizza pizza) {
        this.pizzas.remove(pizza);
        pizza.setCommandes(null);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Commande client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Commande)) {
            return false;
        }
        return id != null && id.equals(((Commande) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Commande{" +
            "id=" + getId() +
            ", estAEmporter='" + getEstAEmporter() + "'" +
            ", dateHeureCreation='" + getDateHeureCreation() + "'" +
            ", dateHeureLivraison='" + getDateHeureLivraison() + "'" +
            "}";
    }
}
