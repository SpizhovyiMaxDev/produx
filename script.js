'use strict';

class Product{
     constructor(src, link, name, description, price, type){
        this.src = src;
        this.link = link;
        this.name = name;
        this.description = description;
        this.price = price;
        this.type = type;
     }

       set price(p){
        if(isFinite(+p.split('').filter(el => el !== '$').join(''))){
            this._price = +p.split('').filter(el => el !== '$').join('')
        }else{
            this._price = 'free'
        }
       }
 
     set link(s){
        s.startsWith('http') ? 
        this._link = s :
        this._link = 'current Link Wasn\'t added'
     }
}


class App{
    header = document.querySelector('header');
    heroSection = document.querySelector('.section-hero')
    navigation = document.querySelector('.main-nav-list');
    btnNavigation = document.querySelector('.nav-btn')
    #navObserver;
    modal = document.querySelector('.modal');
    overlay = document.querySelector('.overlay');

    products = document.querySelector('.products')

    btnSort = document.querySelector('.aside--sort-cards_menu');
    #cards = [...document.querySelectorAll('.card')];
    #id = undefined;

    projectContainer = document.querySelector('.products');

    btnCreateCard = document.querySelector('.btn-create')

    btnUploadImage = document.querySelector('.btn-upload');
    #uploadImage = false;

    btnShowModal = document.querySelector('.btn-card-add');
    btnCloseModal = document.querySelector('.modal-close');

    containerProducts = document.querySelector('.aside-text-box');

    constructor(){

        this.navigation.addEventListener('click', this._scrollTo.bind(this));
        this.btnNavigation.addEventListener('click', this._toggleNav.bind(this));

        this.#navObserver = new IntersectionObserver(
            this._animateNav.bind(this),
            {
                root:null,
                threshold:0,
                rootMargin:`-${this.header.getBoundingClientRect().height}px`
            }
        )
        this.#navObserver.observe(this.heroSection);

        this.btnShowModal.addEventListener('click', this._showModal.bind(this));
        this.btnCloseModal.addEventListener('click', this._closeModal.bind(this));

        this.btnCreateCard.addEventListener('click', this._addCard.bind(this));
        this.btnUploadImage.addEventListener('change', this._uploadImage.bind(this));

        this.containerProducts.addEventListener('click', this._setAnimationToProduct.bind(this));
        this.containerProducts.addEventListener('change', this._sortProduct.bind(this))
    }

    _scrollTo(e){
        const link = e.target.closest('.nav-link');
        const id = link.getAttribute('href');
        if(!link)return;
        
          if(!id.includes('http')){
            e.preventDefault();
            this.header.classList.remove('nav-open');
            window.innerWidth <= 944 ? setTimeout(() =>  document.querySelector(id).scrollIntoView({behavior:'smooth'}), 500) : document.querySelector(id).scrollIntoView({behavior:'smooth'});
          }
    }

    _toggleNav(e){
        this.header.classList.toggle('nav-open')
        e.stopPropagation();
    }

    _animateNav(entries){
        const [entry] = entries;
        document.body.classList.toggle('sticky', !entry.isIntersecting);
    }

    _showModal(e){
        this.modal.classList.remove('hidden');
        this.overlay.classList.remove('hidden');
        e.stopPropagation();
    }

    _closeModal(e){
        this.modal.classList.add('hidden');
        this.overlay.classList.add('hidden');
        e.stopPropagation();
    }


    _uploadImage(e){
        e.stopPropagation();
        const file = this.btnUploadImage.files[0];
        this.#uploadImage = file;
    }
    
    _addCard(e) {
        e.stopPropagation();
      
        const name = document.querySelector('#name').value;
        const price = document.querySelector('#price').value;
        const link = document.querySelector('#link').value;
        const description = document.querySelector('#description').value;
        const type = document.querySelector('.select-type').value;
      
        let product = false;
      
        const inputs = [name, price, link, description];
      
        if (inputs.every(input => input.length !== 0)) {
          product = new Product(this.#uploadImage, link, name, description, price, type);
          this.modal.classList.add('hidden');
          this.overlay.classList.add('hidden');
        } else return alert('Complete all inputs and Include paste your Image!!!');
      
        if (!product) return;

        const figure = document.createElement('figure');
        figure.classList.add('card');
        figure.dataset.price = product._price === 'free' ? 0 : product._price;
        figure.dataset.type = product.type;
        figure.innerHTML = `
          <div class="card-img-box">
            <img class="card-img" src="${URL.createObjectURL(product.src)}" class="img-card"/>
          </div>
      
          <div class="text-box">
            <p class="card-name">${product.name}</p>
      
            <p class="product-price"><span class="dollar">${isFinite(product._price) ? '$' : ''}</span>${product._price}</p>
      
            <p class="card-description">
              ${product.description}
            </p>
            <a href="${product._link}" target="_blank" class="card-link">Message to Owner</a>
          </div>
        `;
      
 
        this.#cards.push(figure);
        this.products.append(figure);
      }
      
      static createCard(arr, product){
        `
        <figure class = "card"  data-price = ${product._price} data-type = ${product.type}>
          <div class="card-img-box">
            <img class="card-img" src="${URL.createObjectURL(product.src)}" class="img-card"/>
          </div>
      
          <div class="text-box">
            <p class="card-name">${product.name}</p>
      
            <p class="product-price"><span class="dollar">${isFinite(product._price) ? '$' : ''}</span>${product._price}</p>
      
            <p class="card-description">
              ${product.description}
            </p>
            <a href="${product._link}" target="_blank" class="card-link">Message to Owner</a>
          </div>
        </figure>
        `

        arr.insertAdjacentHTML('beforeend', );
      }


    _setAnimationToProduct(e){
     /*
        ---- 
        Here I used this.#cards because we need access to the original NodeList, we dont need to get a new collection
        ----
     */
        if(e.target.classList.contains('aside--list-item')){
           this.#id = e.target.dataset.id;
           const sort = document.querySelector('.aside--sort-cards_menu');

           if(this.#id === 'mixed'){
                this._removeAllCards();
                this.#cards.forEach(card => this.products.append(card));
                sort.value = 'Sort:'
            }else{
                this._removeAllCards()
                this._filterCards(this.#id);
                sort.value = 'Sort:'
            }
        }
    }

    _sortProduct(e){

        /*
        ---- 
        Here I used currentCards because I work with a current NodeList cards, 
        I mean I want to sort the cards by price that we have on the page in the current moment.
        ----
        */

        if(e.target.classList.contains('aside--sort-cards_menu')){
            const type = e.target.value;
            const currentCards = [...document.querySelectorAll('.card')];

            if(type === 'Sort by highest price'){
                this._removeAllCards();
                currentCards.slice().sort((a, b) => b.dataset.price - a.dataset.price).forEach(card => this.products.appendChild(card));
                // toSorted() => I would use this method, but the problem is that older browsers do not support this method
            }

            if(type === 'Sort by lowest price'){
                this._removeAllCards();
                currentCards.slice().sort((a, b) => a.dataset.price - b.dataset.price).forEach(card => this.products.appendChild(card));
             // toSorted() => I would use this method, but the problem is that older browsers do not support this method (same -v-) 
            }

        }
    }

    _removeAllCards(){
        document.querySelectorAll('.card').forEach(card => card.dataset.type !== 'card-create' && this.products.removeChild(card));
    }

    _filterCards(item){
      return [...this.#cards].filter(card => card.dataset.type === item ? this.products.append(card) : item);
    }


}

const app = new App();
