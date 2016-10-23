'use strict';

class Slider {
    constructor(options) {
        this.img = options.img;
        this.wrapper = options.wrapper;
        this.count = -100;
        this.index;
        this.statusClick = true;
        this.wrapper.addEventListener('click', bind(this.listenerEvent, this));
        this.wrapper.addEventListener('transitionend', bind(this.listenerEvent, this))
    }

    listenerEvent(event) {
        if (event.type == 'click') {
            if (event.target.classList.contains('button-1')) this.left();
            if (event.target.classList.contains('button-2')) this.right();


            if (event.target.hasAttribute('data-index')) {
                let index = event.target.dataset.index;
                this.count = -index * 100;
                this.carouselImg.style.transition = 'left 700ms';
                this.setMainImg();
                this.setActiveDot();
            }
        }

        if (event.type == "transitionend") {}

    }

    renderSlider() {
        let limiterForWidth = document.createElement('div'),
            carouselImg = document.createElement('div');

        limiterForWidth.classList.add('limiterForWidth');
        carouselImg.classList.add('carouselImg');

        carouselImg.style.width = `${this.wrapper.offsetWidth * (this.img.length + 2) }px`;

        for (let i = 0; i < this.img.length; i++) {
            let img = document.createElement('img');
            img.src = this.img[i];
            img.style.width = `${this.wrapper.offsetWidth}px`;
            carouselImg.appendChild(img);
        }

        for (let i = 0; i < 2; i++) {
            let img = document.createElement('img');

            if (i == 0) {
                img.src = this.img[this.img.length - 1];
                carouselImg.insertAdjacentElement('afterBegin', img);
            } else {
                img.src = this.img[0];
                carouselImg.insertAdjacentElement('beforeEnd', img);
            }
            img.style.width = `${this.wrapper.offsetWidth}px`;
        }


        limiterForWidth.appendChild(carouselImg);
        this.wrapper.appendChild(limiterForWidth);

        this.carouselImg = carouselImg;
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
            elem.setAttribute('data-index', i);
            boxElem.appendChild(elem);
        }
        this.index = 1;
        this.wrapper.appendChild(boxElem);
        this.boxElem = boxElem;
    }

    left() {
        if (this.statusClick) {
            this.count += 100;

            this.carouselImg.style.transition = 'left 700ms';
            this.setMainImg();
            this.startShift();
            this.setActiveDot();
        }
    }

    right() {
        if (this.statusClick) {
            this.count -= 100;

            this.carouselImg.style.transition = 'left 700ms';
            this.setMainImg();
            this.startShift();
            this.setActiveDot();
        }
    }

    startShift() {
        this.statusClick = false;
        window.ontransitionend = bind(function() {
            if (this.count == 0) {
                this.count = this.getShiftInterval() + 100;
                this.carouselImg.style.transition = '';
                this.setMainImg();
                this.setActiveDot();
            }

            if (this.count == this.getShiftInterval()) {

                this.count = -100;
                this.carouselImg.style.transition = '';
                this.setMainImg();
                this.setActiveDot();
            }

            this.statusClick = true;
            window.ontransitionend = null;
        }, this)
    }

    getShiftInterval() {
        return - +(this.img.length + 1 + '00');
    }

    setMainImg() {
        this.carouselImg.style.left = `${this.count}%`;
    }

    setActiveDot() {
        for (let i = 0; i < this.img.length; i++) {
            this.boxElem.children[i].classList.remove('active');
        }

        let count = this.count * -1 / 100 - 1;
        if (count > this.boxElem.children.length - 1) count = 0;
        if (count < 0) count = this.boxElem.children.length - 1;

        this.boxElem.children[count].classList.add('active');
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
        this.setMainImg();
        this.setActiveDot();
    }
}

let slider = new Slider({
    img: ["image/img-1.jpg", "image/img-2.jpg", "image/img-3.jpg", "image/img-4.jpg", "image/img-5.jpg", "image/img-6.jpg", "image/img-7.jpg"],
    wrapper: document.getElementById("slider")
});

slider.start();
slider.getShiftInterval();
console.dir(slider)
