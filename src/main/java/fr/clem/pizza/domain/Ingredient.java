package fr.clem.pizza.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ingredient.
 */
@Entity
@Table(name = "ingredient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ingredient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "quantite")
    private Double quantite;

    @Column(name = "prix")
    private Double prix;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ingredients", "clients", "commandes" }, allowSetters = true)
    private Pizza pizza;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ingredient id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Ingredient nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Double getQuantite() {
        return this.quantite;
    }

    public Ingredient quantite(Double quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Double quantite) {
        this.quantite = quantite;
    }

    public Double getPrix() {
        return this.prix;
    }

    public Ingredient prix(Double prix) {
        this.setPrix(prix);
        return this;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public Pizza getPizza() {
        return this.pizza;
    }

    public void setPizza(Pizza pizza) {
        this.pizza = pizza;
    }

    public Ingredient pizza(Pizza pizza) {
        this.setPizza(pizza);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ingredient)) {
            return false;
        }
        return id != null && id.equals(((Ingredient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ingredient{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", quantite=" + getQuantite() +
            ", prix=" + getPrix() +
            "}";
    }
}
