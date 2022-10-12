package fr.clem.pizza.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pizza.
 */
@Entity
@Table(name = "pizza")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pizza implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prix")
    private Double prix;

    @OneToMany(mappedBy = "pizza")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pizza" }, allowSetters = true)
    private Set<Ingredient> ingredients = new HashSet<>();

    @OneToMany(mappedBy = "pizza")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pizza", "commandes" }, allowSetters = true)
    private Set<Client> clients = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "pizzas", "client" }, allowSetters = true)
    private Commande commandes;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pizza id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Pizza nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Double getPrix() {
        return this.prix;
    }

    public Pizza prix(Double prix) {
        this.setPrix(prix);
        return this;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public Set<Ingredient> getIngredients() {
        return this.ingredients;
    }

    public void setIngredients(Set<Ingredient> ingredients) {
        if (this.ingredients != null) {
            this.ingredients.forEach(i -> i.setPizza(null));
        }
        if (ingredients != null) {
            ingredients.forEach(i -> i.setPizza(this));
        }
        this.ingredients = ingredients;
    }

    public Pizza ingredients(Set<Ingredient> ingredients) {
        this.setIngredients(ingredients);
        return this;
    }

    public Pizza addIngredient(Ingredient ingredient) {
        this.ingredients.add(ingredient);
        ingredient.setPizza(this);
        return this;
    }

    public Pizza removeIngredient(Ingredient ingredient) {
        this.ingredients.remove(ingredient);
        ingredient.setPizza(null);
        return this;
    }

    public Set<Client> getClients() {
        return this.clients;
    }

    public void setClients(Set<Client> clients) {
        if (this.clients != null) {
            this.clients.forEach(i -> i.setPizza(null));
        }
        if (clients != null) {
            clients.forEach(i -> i.setPizza(this));
        }
        this.clients = clients;
    }

    public Pizza clients(Set<Client> clients) {
        this.setClients(clients);
        return this;
    }

    public Pizza addClient(Client client) {
        this.clients.add(client);
        client.setPizza(this);
        return this;
    }

    public Pizza removeClient(Client client) {
        this.clients.remove(client);
        client.setPizza(null);
        return this;
    }

    public Commande getCommandes() {
        return this.commandes;
    }

    public void setCommandes(Commande commande) {
        this.commandes = commande;
    }

    public Pizza commandes(Commande commande) {
        this.setCommandes(commande);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pizza)) {
            return false;
        }
        return id != null && id.equals(((Pizza) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pizza{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prix=" + getPrix() +
            "}";
    }
}
