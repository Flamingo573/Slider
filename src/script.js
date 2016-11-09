'use strict';

class Slider {
    constructor(options) {
        this.wrapper = options.wrapper;
        this.limiter = options.limiter;
        this.margin = options.margin;
        this.amountImg = options.amountImage;
        this.carousel = options.carousel;
        this.activeDot = 0;
        this.autoPlayTime = options.autoPlayTime;

        this.carousel.ondragstart = () => false;

        this.wrapper.addEventListener('click', bind(this.listenerEvent, this));
        this.wrapper.addEventListener('mousedown', bind(this.listenerEvent, this));
        window.addEventListener('resize', bind(this.listenerEvent, this));
        this.limiter.addEventListener('touchstart', bind(this.listenerEvent, this));
        this.limiter.addEventListener('mousedown', bind(this.listenerEvent, this));
    }

    // УСТАНОВКА ПЕРВОНАЧАЛЬНЫХ РАЗМЕРОВ И ОТСТУПОВ
    // ===================================================================================================

    fitWidth() { // Метод для установления соответствия между шириной родителя и количеством отображаемых слайдов
        for (let key in this.amountImg) {
            if (this.getWidthWrapper() <= this.amountImg[key]) {
                this.getWidthImg(key);
                this.currentAmountImg = key;
                break;
            }
        }
    }

    getWidthWrapper() { // Метод для полученя ширины родителя
        return this.wrapper.offsetWidth;
    }

    getWidthImg(amount) { // Метод для расчета ширины слайда
        this.widthImg = (this.getWidthWrapper() - this.margin * (amount - 1)) / amount;
    }

    setWidthImg() { // Метод для установки шириный и отступа слайда
        for (let i = 0; i < this.carousel.children.length; i++) {
            let elem = this.carousel.children[i];
            elem.style.width = `${this.widthImg}px`;
            elem.style.marginRight = `${this.margin}px`;
        }
    }

    setWidthCarousel() { // Метод для установки ширины карусели
        this.widthCarousel = this.carousel.children.length * (this.widthImg + this.margin);
        this.carousel.style.width = `${this.widthCarousel}px`;
    }

    getStartPositionCaroisel() {
        this.count = -this.getWidthWrapper() - this.margin;
        return this.count;
    }

    // ОБРАБОТЧИК СОБЫТИЙ
    // ===================================================================================================

    listenerEvent(event) {
            if (event.type == 'click') {
                if (this.wrapper.contains(event.target)) {
                    if (event.target.className == "button-1") this.left();
                    if (event.target.className == "button-2") this.right();
                    if (this.boxDots.contains(event.target) && event.target.hasAttribute('data-index')) this.selectedDot(event.target);
                }
            }

            if (event.type == 'resize') {
                this.start();
            }

            if (event.type == 'mousedown') {
                this.mouseShiftSlider(event);
            }

            if (event.type == 'touchstart') {
                this.touchShiftSlider(event);
            }


        }
        // СОЗДАНИЕ ЭЛЕМЕНТОВ
        // ===================================================================================================
    renderButtonSlider() { // Создание боковых управляющих кнопок
        if (this.wrapper.querySelector('div[class^="button"]')) return;
        for (let i = 1; i < 3; i++) {
            let elem = document.createElement('div');
            elem.classList.add(`button-${i}`);
            this.wrapper.appendChild(elem);
        }
    }

    renderDots() { // Создание навигационных точек
        let result = this.wrapper.querySelector('.boxDots');
        if (result) {
            this.wrapper.removeChild(result);
        }
        let boxElem = document.createElement('div');
        boxElem.classList.add('boxDots');

        let amountDots = Math.ceil((this.carousel.children.length - this.carousel.querySelectorAll('.clone').length) / this.currentAmountImg);

        for (let i = 0; i < amountDots; i++) {
            let elem = document.createElement('div');
            elem.setAttribute('data-index', i + 1);
            boxElem.appendChild(elem);
        }

        this.amountDots = amountDots;

        this.wrapper.appendChild(boxElem);
        this.boxDots = boxElem;
    }

    addClone() { // Создает дополнительные элементы
        let result = this.carousel.getElementsByClassName('clone');

        if (result.length) {
            for (let i = 0; i < result.length; i++) {

                this.carousel.removeChild(result[i]);
                i--;
            }
        }

        let cloneInStart = [];
        let cloneInEnd = [];

        for (let i = this.carousel.children.length - 1; i > this.carousel.children.length - 1 - this.currentAmountImg; i--) {
            let elem = this.carousel.children[i].cloneNode(true);
            elem.classList.add('clone');
            cloneInStart.push(elem);
        }

        for (let i = 0; i < this.currentAmountImg; i++) {
            let elem = this.carousel.children[i].cloneNode(true);
            elem.classList.add('clone');
            cloneInEnd.push(elem);
        }

        cloneInStart.forEach((item) => this.carousel.insertBefore(item, this.carousel.firstChild));
        cloneInEnd.forEach((item) => this.carousel.appendChild(item));

        this.setWidthCarousel();
    }

    // УПРАВЛЯЮЩИЕ МЕТОДЫ
    // ===================================================================================================
    left() {
        this.autoPlay('reset');
        this.carousel.style.transition = `transform 500ms`;

        this.count += this.widthImg + this.margin;
        if (Math.round(this.count) > -this.getWidthWrapper()) this.endCarousel('left');
        this.setPositionCarousel();
        this.getActiveDots();
    }

    right() {
        this.autoPlay('reset');
        this.carousel.style.transition = `transform 500ms`;

        this.count -= this.widthImg + this.margin;
        if (Math.round(this.count) < this.getLastPositionCarousel()) this.endCarousel('right');
        this.setPositionCarousel();
        this.getActiveDots();
    }

    endCarousel(side) {
        this.carousel.style.transition = '';
        this.count = (side == 'left') ? this.getLastPositionCarousel() : this.getStartPositionCaroisel();
        this.setPositionCarousel();
        (side == 'left') ? setTimeout(bind(this.left, this), 10): setTimeout(bind(this.right, this), 10);
    }

    getLastPositionCarousel() {
        return -this.widthCarousel + this.getWidthWrapper() + this.margin;
    }

    setPositionCarousel() {
        this.carousel.style.transform = `translateX(${this.count}px)`;
    }

    selectedDot(target) {
        this.autoPlay('reset');

        let index = target.getAttribute('data-index');
        this.count = -index * (this.getWidthWrapper() + this.margin);
        this.setPositionCarousel();

        this.activeDot = index - 1;
        this.setActiveDot();
    }

    getActiveDots() {
        let count = Math.abs(Math.round(this.count));

        if (Math.round(this.count) <= this.getLastPositionCarousel()) {
            this.activeDot = 0;
            this.setActiveDot();
            return;
        }

        for (let i = this.amountDots + 1; i != 0; i--) {
            let result = count >= this.objectForShiftDots[i] && count <= this.objectForShiftDots[i + 1];
            if (result) {
                this.activeDot = i - 1;
                this.setActiveDot();
                break;
            }
        }
    }

    setActiveDot() {
        for (let i = 0; i < this.amountDots; i++) {
            this.boxDots.children[i].classList.remove('active');
        }
        this.boxDots.children[this.activeDot].classList.add('active');
    }

    setObjectForShiftDots() {
        let object = {};
        for (let i = 1; i < this.amountDots + 1; i++) {
            object[i] = i * (this.getWidthWrapper() + this.margin);
        }
        object[this.amountDots + 1] = Math.abs(this.getLastPositionCarousel());
        this.objectForShiftDots = object;
    }

    touchShiftSlider(event) {
        this.autoPlay('stop');
        this.carousel.style.transition = '';

        let count = this.count,
            startCoord = event.targetTouches[0].clientX,
            coordMove = 0;

        window.ontouchmove = bind(function(event) {

            coordMove = event.targetTouches[0].clientX;
            this.count = count - (startCoord - coordMove);

            let leftEnd = Math.round(-this.getWidthWrapper() - this.margin);
            let rightEnd = Math.round(this.getLastPositionCarousel());

            if (Math.round(this.count) > leftEnd && Math.round(this.count) > rightEnd) {
                this.count = this.getLastPositionCarousel();
                count = this.count;
                startCoord = coordMove;
            }

            if (Math.round(this.count) < rightEnd && Math.round(this.count) < leftEnd) {
                this.count = -this.getWidthWrapper() - this.margin;
                count = this.count;
                startCoord = coordMove;
            }

            this.setPositionCarousel();
            this.getActiveDots();
        }, this)


        window.ontouchend = bind(function(event) {
            this.carousel.style.transition = 'transform 500ms';

            let shift = (startCoord - (coordMove || startCoord)),
                fullShift = Math.abs(shift / this.widthImg).toFixed(2),
                shiftIntPart = +fullShift.split('.')[0],
                shiftFloatPart = +fullShift.split('.')[1],
                finalShift = (Math.abs(shiftFloatPart) > 25) ? Math.ceil(fullShift) : Math.floor(fullShift);

            if (shift < 0) this.count = count + this.widthImg * finalShift + this.margin * finalShift;
            if (shift > 0) this.count = count - this.widthImg * finalShift - this.margin * finalShift;

            this.setPositionCarousel();
            this.getActiveDots();
            this.autoPlay('play');
            window.ontouchmove = null;
            window.ontouchstart = null;
            window.ontouchend = null;
        }, this);
    }

    mouseShiftSlider(event) {
        this.autoPlay('stop');
        this.carousel.style.transition = '';
        this.wrapper.classList.add('grab');

        let count = this.count,
            startCoord = event.clientX,
            coordMove = 0;

        window.onmousemove = bind(function(event) {

            coordMove = (event.clientX || 1);
            this.count = count - (startCoord - coordMove);

            let leftEnd = Math.round(-this.getWidthWrapper() - this.margin);
            let rightEnd = Math.round(this.getLastPositionCarousel());

            if (Math.round(this.count) > leftEnd && Math.round(this.count) > rightEnd) {
                this.count = this.getLastPositionCarousel();
                count = this.count;
                startCoord = coordMove;
            }

            if (Math.round(this.count) < rightEnd && Math.round(this.count) < leftEnd) {
                this.count = -this.getWidthWrapper() - this.margin;
                count = this.count;
                startCoord = coordMove;
            }

            this.setPositionCarousel();
            this.getActiveDots();
        }, this);

        window.onmouseup = bind(function(event) {
            this.carousel.style.transition = 'transform 500ms';

            let shift = (startCoord - (coordMove || startCoord)),
                fullShift = Math.abs(shift / this.widthImg).toFixed(2),
                shiftIntPart = +fullShift.split('.')[0],
                shiftFloatPart = +fullShift.split('.')[1],
                finalShift = (Math.abs(shiftFloatPart) > 25) ? Math.ceil(fullShift) : Math.floor(fullShift);

            if (shift < 0) this.count = count + this.widthImg * finalShift + this.margin * finalShift;
            if (shift > 0) this.count = count - this.widthImg * finalShift - this.margin * finalShift;

            this.setPositionCarousel();
            this.getActiveDots();

            this.wrapper.classList.remove('grab');
            this.autoPlay('play');

            window.onmousemove = null;
            window.onmousedown = null;
            window.onmouseup = null;
        }, this);
    }

    autoPlay(status) {
        let time = this.autoPlayTime;
        if (!time) return;

        if (status == 'play') {
            clearInterval(this.timeId);
            this.timeId = setInterval(bind(function func() {
                this.right();
                //this.timeId = setTimeout(bind(func, this), time);
            }, this), time);
        }

        if (status == 'stop') {
            clearInterval(this.timeId);
        }

        if (status == 'reset') {
            clearInterval(this.timeId);
            this.autoPlay('play');
        }
    }

    // ЗАПУСК СЛАЙДЕРА
    // ===================================================================================================
    start() {
        this.fitWidth();
        this.setWidthImg();
        this.getStartPositionCaroisel();
        this.setPositionCarousel();
        this.renderButtonSlider();
        this.renderDots();
        this.setActiveDot();
        this.addClone();
        this.setObjectForShiftDots();
        this.autoPlay('play');
    }
}

let slider = new Slider({
    wrapper: document.getElementById("slider"),
    carousel: document.getElementsByClassName('carousel')[0],
    limiter: document.getElementsByClassName('limiterForWidth')[0],
    amountImage: {
        5: 960,
        3: 850,
        1: 500
    },
    margin: 10,
    autoPlayTime: 5000 //ms || false
});

slider.start();
