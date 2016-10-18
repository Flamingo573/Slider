'use strict';

class Slider {
    constructor(options) {
        this.img = options.img;
        this.wrapper = options.wrapper;
        this.count = 0;

        this.wrapper.addEventListener('click', bind(this.listenerClick, this));
    }

    listenerClick(event) {
        if (event.target.closest('div[class^="button"]')) {
            if (event.target.className == "button-1") this.left();
            else this.right();
        }

        if (event.target.closest('div[class^="dot"]')) {
            let selectedDot = event.target.className.split(' ')[0];

            this.count = +selectedDot.charAt(selectedDot.length - 1) - 1;

            this.setMainImg();
            this.setActiveDot();
        }
    }

    renderSlider() {
        let elem = document.createElement('img');
        elem.src = this.img[this.count];
        this.wrapper.appendChild(elem);
        this.mainImg = elem;
    }

    renderButtonSlider() {
        for (let i = 1; i < 3; i++) {
            let elem = document.createElement('div');
            elem.classList.add(`button-${i}`);
            this.wrapper.appendChild(elem);
        }
    }

    renderDots() {
        let boxElem = document.createElement('div');
        boxElem.classList.add('boxDots');

        for (let i = 1; i < this.img.length + 1; i++) {
            let elem = document.createElement('div');
            elem.classList.add(`dot-${i}`);
            boxElem.appendChild(elem);
        }
        boxElem.children[this.count].classList.add('active');
        this.wrapper.appendChild(boxElem);
        this.boxElem = boxElem;
    }

    left() {
        this.count--;
        if (this.count < 0) this.count = this.img.length - 1;

        this.setMainImg();
        this.setActiveDot();
    }

    right() {
        this.count++;
        if (this.count > this.img.length - 1) this.count = 0;

        this.setMainImg();
        this.setActiveDot();
    }

    setMainImg() {
        this.mainImg.src = this.img[this.count];
    }

    setActiveDot() {
        for (let i = 0; i < this.img.length; i++) {
            this.boxElem.children[i].classList.remove('active');
        }

        this.boxElem.children[this.count].classList.add('active');
    }

    preloadImg() {
        for (let i = 0; i < this.img.length; i++) {
            let img = document.createElement("img").src = this.img[i];
        }
    }



    start() {
        this.preloadImg();
        this.renderSlider();
        this.renderButtonSlider();
        this.renderDots();
    }
}

let slider = new Slider({
    img: ["image/img-1.jpg", "image/img-2.jpg", "image/img-3.jpg", "image/img-4.jpg", "image/img-5.jpg", "image/img-6.jpg", "image/img-7.jpg"],
    wrapper: document.getElementById("slider")
});

slider.start();

console.dir(slider)
