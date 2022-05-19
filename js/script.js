'use strict'; 

import {all_sliders} from './data.js';


const menuElem = document.querySelector('.menu');
const burgerElem = document.querySelector('.burger')
document.querySelector(".burger").addEventListener("click", function () {
	this.classList.toggle("active");
	menuElem.classList.toggle('active');	 
});  

document.addEventListener('scroll', ()=>{
	if(window.scrollY > 90){
		menuElem.classList.remove('active');
		burgerElem.classList.remove('active');
	};
});


const liElem = document.querySelectorAll('.menu ul li');
const pageList = document.querySelectorAll('.page');

liElem.forEach((link , index) => {

    link.addEventListener('click', function(e) {
        e.preventDefault();       
                
        const elementPosition = pageList[index].getBoundingClientRect().top;
        
        window.scrollBy({
            top: elementPosition,
            behavior: 'smooth'
        });
    });
});

class MSlider {
	constructor(identifier, mediaPath, objList) {
		this.identifier = identifier;
		this.mediaPath = mediaPath;
		this.objList = objList;
		this.rootElem = document.querySelector(`#${this.identifier}s`);
		this.fildsArr = ['container', 'main', 'film', 'btn', 'title', 
			'trigger', 'trg_left', 'trg_right'];

		const sliderObject = this.getSliderObject();

		for (const [key, value] of Object.entries(sliderObject)) {			 
			 
			this[key] = value;			
		}
		
		this.imgIndex = 0;
		this.film_elems = this.createFilmCards();
		this.rootElem.append(this.container);
		this.ulElem = this.createIndecator();
		this.container.append(this.ulElem);
		this.film.append(...this.film_elems);

		this.trg_left.addEventListener('click', () => {

			this.imgIndex--;
		
			if (this.imgIndex < 0) {
				this.imgIndex = this.objList.length - 1;
			}
			this.render();
		});
		
		this.trg_right.addEventListener('click', () => {
		
			this.imgIndex++;
		
			if (this.imgIndex > this.objList.length - 1) {
				this.imgIndex = 0;
			}
			this.render();
		});
	  }

	getSliderObject() {

		const result = {};

		for (let fild of this.fildsArr) {
			result[fild] = document.createElement('div');
			result[fild].classList.add(`${this.identifier}-${fild}`);
		}

		this.setBackgroundImage(result.trg_left, 'icons/back.png');
		this.setBackgroundImage(result.trg_right, 'icons/next.png');	 
		
		result.trigger.append(result.trg_left, result.trg_right);
		result.main.append(result.film, result.trigger);
		result.container.append(result.main);	
		
		return result;
	} 

  	createFilmCards() {
	
		return this.objList.map(obj => {
		
			const slider_width = this.identifier === "client" ? '255' : this.container.offsetWidth,
				divElem = document.createElement('div');
				divElem.style.width = slider_width + 'px';

				if (obj.img) {
					divElem.style.backgroundImage = `url('${this.mediaPath + obj.img}')`;
				}	

				if (obj.backgroundColor) {
					divElem.style.backgroundColor = obj.backgroundColor;
				}	
				
				let cardElem = undefined;
				if (this.identifier === "review") {

					cardElem = document.createElement('div');
					cardElem.classList.add('content-review')

					const pElem = document.createElement('p');
					pElem.innerText = obj.text;
					pElem.classList.add('p-review');
				
					const humanImg = document.createElement('div');
					humanImg.style.backgroundImage = `url('${this.mediaPath + obj.card_img}')`;
					humanImg.classList.add('humanImg');
				
					const humanName = document.createElement('h5');
					humanName.innerText = obj.name;
					humanName.classList.add('humanName');
				
					const humanСompany = document.createElement('p');	
					humanСompany.innerText = obj.company;	
					humanСompany.classList.add('humanСompany');
					
					const humanText = document.createElement('div');
					humanText.classList.add('humanText');
					humanText.append(humanName, humanСompany);
				
					const humanElem = document.createElement('div');
					humanElem.classList.add('human');
					humanElem.append(humanImg, humanText);
									
					cardElem.append(pElem, humanElem);
					divElem.append(cardElem);
				}
				else
				{
					cardElem = document.createElement('div');
					cardElem.classList.add('content-header')	

					if (obj.text) {
						const h2Elem = document.createElement('div');
						h2Elem.innerText = obj.text;
						h2Elem.classList.add('h2-header');
						cardElem.append(h2Elem);
					}

					if (obj.btn_text) {
						const btnElem = document.createElement('button');
						btnElem.innerText = obj.btn_text;
						btnElem.classList.add('btn-header');
						cardElem.append(btnElem);
					}	
					divElem.append(cardElem);		
				}				

				
				return divElem;			
			})	  	
	}

   render() {

		let divider = this.identifier === "client" ? 0 : 1
		this.film.style.right = this.getAdaptFilmWidth(
			this.container.offsetWidth, this.imgIndex, divider);

		const liList = document.querySelectorAll(`.${this.identifier}-points li`);

		liList.forEach(t => t.classList.remove('active'));

		if (liList.length > 0) {
			liList[this.imgIndex].classList.add('active');
		}
	}

	changeSize() {	
		
		let divider = this.identifier === "client" ? 0 : 1
		this.film.style.width = this.getAdaptFilmWidth(
			this.container.offsetWidth, this.objList.length, divider);
		
		let card_width = this.identifier === "client" ?  '255': this.container.offsetWidth
		
		this.film_elems.forEach(elem => elem.style.width = card_width + 'px');

		this.render();
	}

	createIndecator() {
		const ulElem = document.createElement('ul');
		ulElem.classList.add(`${this.identifier}-points`);  

		ulElem.append(...this.objList.map((_, index)=>{
			const elem = document.createElement('li');
			elem.addEventListener('click', event=>{
				const liElem = event.target;
				const liList = [...liElem.parentNode.children];
				this.imgIndex = liList.indexOf(liElem);
				this.render();
			});
			return elem;
		}));
		return ulElem;		
	}

	getAdaptFilmWidth(container_width, item_count, divider = 0) {
	 
		if (divider === 0){		
			const test = [
				{width:1200,  divider: 4}, 
				{width:900,  divider: 3}, 
				{width:650,  divider: 2},
				{width:0,  divider: 1}
			];
		
			divider = test.filter(value => 
					container_width >= value.width)[0].divider;
		}

		return container_width/divider * item_count + 'px';
	}

	setBackgroundImage(elem, img) {
		elem.style.backgroundImage = `url(${img})`;
		elem.style.backgroundRepeat = "no-repeat";
		elem.style.backgroundPosition = "center";
	}
}

//Создадим слайдеры
const slider_obj = [];

all_sliders.forEach(elem => {
	 
	let objSlider = new MSlider(elem.identifier, elem.mediaPath, elem.objList);
	objSlider.render()
	objSlider.changeSize();

	slider_obj.push(objSlider);
});

window.addEventListener('resize', () => {
	slider_obj.forEach(elem => elem.changeSize())
});