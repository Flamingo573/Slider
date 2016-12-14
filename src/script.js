'use strict';

// * Раздел № 1 - ОБРАБОТЧИК СОБЫТИЙ
// *
// * Раздел № 2 - УПРАВЛЯЮЩИЕ МЕТОДЫ
// *   2.1 - Главные методы
// *   2.2 - Вспомогательные методы
// *
// * Раздел № 3 - УСТАНОВКА ПОЗИЦИЙ, РАЗМЕРОВ И ОТСТУПОВ
// *   3.1 - Главные методы
// *   3.2 - Вспомогательные методы
// *
// * Раздел № 4 - СОЗДАНИЕ ЭЛЕМЕНТОВ
// *
// * Раздел № 5 - АВТОМАТИЧЕСКОЕ ПЕРЕКЛЮЧЕНИЕ СЛАЙДЕРА
// *
// * Раздел № 6 - ЗАПУСК СЛАЙДЕРА
// *

class Slider {
    /**
     * Конструктор Slider создает все необходимое для рабыты слайдера.
     * В качестве "слайдов" принимает любые элементы.
     * @param {object} options - Содержит: элементы, отступ, желаемое кол-во отображаемых за раз элементов,
     *  время между автоматическим переключением слайдов.
     */
    constructor(options) {
        this.wrapper = options.wrapper;
        this.limiter = options.limiter;
        this.margin = options.margin;
        this.amountImg = options.amountImage;
        this.carousel = options.carousel;
        this.activeDot = 0;
        this.autoPlayTime = options.autoPlayTime;

        this.bindMove = bind(this.eventMove, this);
        this.bindUp = bind(this.eventUp, this);

        this.carousel.ondragstart = () => false;

        this.limiter.addEventListener('mousedown', bind(this.eventDown, this));
        this.limiter.addEventListener('touchstart', bind(this.eventDown, this));
        this.wrapper.addEventListener('click', bind(this.listenerEvent, this));
        window.addEventListener('resize', bind(this.listenerEvent, this));
    }


    // № 1 - ОБРАБОТЧИК СОБЫТИЙ
    // ===================================================================================================

    /**
     * Обрабатывает события click и resize.
     * Руководит навигационными элементами.
     */
    listenerEvent(event) {
        if (event.type == 'resize') {
            this.start();
            return;
        }

        if (this.wrapper.contains(event.target)) {
            if (event.target.className == "button-1") this.left();
            if (event.target.className == "button-2") this.right();
            if (this.boxDots.contains(event.target) && event.target.hasAttribute('data-index')) this.selectedDot(event.target);
        }
    }


    // № 2 - УПРАВЛЯЮЩИЕ МЕТОДЫ
    // ===================================================================================================

    // 2.1 - Главные методы
    // =========================================

    /**
     * Пролистывает один слайд в лево
     */
    left() {
        this.autoPlay('reset');
        this.carousel.style.transition = `transform 500ms`;

        this.count += this.widthImg + this.margin;
        if (Math.round(this.count) > -this.getWidthWrapper()) this.endCarousel('left');
        this.setPositionCarousel();
        this.getActiveDots();
    }

    /**
     * Пролистывает один слайд в право
     */
    right() {
        this.autoPlay('reset');
        this.carousel.style.transition = `transform 500ms`;

        this.count -= this.widthImg + this.margin;
        if (Math.round(this.count) < this.getLastPositionCarousel()) this.endCarousel('right');
        this.setPositionCarousel();
        this.getActiveDots();
    }

    /**
     * Обрабатывает нажатие по навигационным точкам.
     */
    selectedDot(target) {
        this.carousel.style.transition = `transform 250ms`;
        this.autoPlay('reset');

        let index = target.getAttribute('data-index');
        this.count = -index * (this.getWidthWrapper() + this.margin);
        this.setPositionCarousel();

        this.activeDot = index - 1;
        this.setActiveDot();
    }

    /**
     * Обрабатывает событие mousedown.
     */
    eventDown(event) {
        this.autoPlay('stop');
        this.carousel.style.transition = '';
        this.wrapper.classList.add('grab');

        let count = this.count,
            startCoord = this.getCoordX(event),
            coordMove = 0;

        this.dragObj = {
            startCoord: this.getCoordX(event),
            count: this.count,
            coordMove: 0,
            coordMove: 0,
            swipePlay: false
        };

        this.controlEventListener(event)
    }

    /**
     * Обрабатывает событие mousemove.
     */
    eventMove(event) {
        this.dragObj.swipePlay = true;

        this.dragObj.coordMove = (this.getCoordX(event) || 1);

        this.count = this.dragObj.count - (this.dragObj.startCoord - this.dragObj.coordMove);

        let leftEnd = Math.round(-this.getWidthWrapper() - this.margin);
        let rightEnd = Math.round(this.getLastPositionCarousel());

        if (Math.round(this.count) > leftEnd && Math.round(this.count) > rightEnd) {
            this.count = this.getLastPositionCarousel();
            this.dragObj.count = this.count;
            this.dragObj.startCoord = this.dragObj.coordMove;
        }

        if (Math.round(this.count) < rightEnd && Math.round(this.count) < leftEnd) {
            this.count = -this.getWidthWrapper() - this.margin;
            this.dragObj.count = this.count;
            this.dragObj.startCoord = this.dragObj.coordMove;
        }

        this.setPositionCarousel();
        this.getActiveDots();
    }

    /**
     * Обрабатывает событие mouseup.
     */
    eventUp(event) {
        this.controlEventListener(event);
        this.wrapper.classList.remove('grab');

        if (!this.dragObj.swipePlay) return;

        this.carousel.style.transition = `transform 250ms`;

        let startPos, i, diff;

        for (i = 0; i < this.arraytForNav.length; i++) {
            if (this.count <= this.arraytForNav[i]) {
                startPos = this.arraytForNav[i];
                break;
            }
        }

        if (this.dragObj.startCoord - this.dragObj.coordMove > 0) {
            diff = Math.abs(this.count - startPos);

            if (diff > 70) this.count = this.arraytForNav[i - 1];
            else this.count = this.arraytForNav[i];
        }

        if (this.dragObj.startCoord - this.dragObj.coordMove < 0) {
            diff = Math.abs(this.count - this.arraytForNav[i - 1]);

            if (diff > 70) this.count = this.arraytForNav[i];
            else this.count = this.arraytForNav[i - 1]
        }

        this.autoPlay('play');
        this.setPositionCarousel();
        this.getActiveDots();
    }

    // 2.2 - Вспомогательные методы
    // =========================================

    /**
     * Используется в методах left, right, при достижении конца карусели, возвращает её на противоположенный край.
     * @param {string} side - Направление пролистывания при котором закончилась карусель.
     */
    endCarousel(side) {
        this.carousel.style.transition = '';
        this.count = (side == 'left') ? this.getLastPositionCarousel() : this.getStartPositionCaroisel();
        this.setPositionCarousel();
        (side == 'left') ? setTimeout(bind(this.left, this), 10): setTimeout(bind(this.right, this), 10);
    }

    /**
     * Возвращает  крайнюю позицию карусели
     * @return {namber} Конечный сдвиг карусели.
     */
    getLastPositionCarousel() {
        return -this.widthCarousel + this.getWidthWrapper() + this.margin;
    }

    /**
     * Возвращает  начальную позицию карусели, задает свойство count.
     * @return {namber} Начальный сдвиг карусели.
     */
    getStartPositionCaroisel() {
        this.count = -this.getWidthWrapper() - this.margin;
        return this.count;
    }

    /**
     * Устанавливает ширину карусели.
     */
    setPositionCarousel() {
        this.carousel.style.transform = `translateX(${this.count}px)`;
    }

    /**
     * Обновляет свойство activeDot в котором содержится индекс активной точки.
     */
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

    /**
     * Добавляет класс active к активной точке.
     */
    setActiveDot() {
        for (let i = 0; i < this.amountDots; i++) {
            this.boxDots.children[i].classList.remove('active');
        }
        this.boxDots.children[this.activeDot].classList.add('active');
    }

    /**
     * Возвращает координату мыши по x, в зависимости от типа события.
     * @return {namber} Координата x.
     */
    getCoordX(event) {
        if (event.type == 'mousedown' || event.type == 'mousemove') {
            return event.pageX;
        }

        if (event.type == 'touchstart' || event.type == 'touchmove') {
            return event.touches[0].pageX
        }
    }

    /**
     * Назначает или удаляет обработчик, в зависимости от типа события.
     */
    controlEventListener(event) {
        if (event.type == 'mousedown') {
            window.addEventListener('mousemove', this.bindMove);
            window.addEventListener('mouseup', this.bindUp);
        }
        if (event.type == 'mouseup') {
            window.removeEventListener('mousemove', this.bindMove);
            window.removeEventListener('mouseup', this.bindUp);
        }

        if (event.type == 'touchstart') {
            window.addEventListener('touchmove', this.bindMove);
            window.addEventListener('touchend', this.bindUp);
        }
        if (event.type == 'touchend') {
            window.removeEventListener('touchmove', this.bindMove);
            window.removeEventListener('touchend', this.bindUp);
        }
    }


    // № 3 - УСТАНОВКА ПОЗИЦИЙ, РАЗМЕРОВ И ОТСТУПОВ
    // ===================================================================================================

    // 3.1 - Главные методы
    // =========================================

    /**
     * Рассчитывает ширину слайда.
     */
    getWidthImg(amount) {
        this.widthImg = (this.getWidthWrapper() - this.margin * (amount - 1)) / amount;
    }

    /**
     * Устанавливает ширину и отступ каждому слайду.
     */
    setWidthImg() {
        for (let i = 0; i < this.carousel.children.length; i++) {
            let elem = this.carousel.children[i];
            elem.style.width = `${this.widthImg}px`;
            elem.style.marginRight = `${this.margin}px`;
        }
    }

    /**
     * Устанавливает ширину карусели.
     */
    setWidthCarousel() {
        this.widthCarousel = this.carousel.children.length * (this.widthImg + this.margin);
        this.carousel.style.width = `${this.widthCarousel}px`;
    }

    // 3.2 - Вспомогательные методы
    // =========================================

    /**
     * Устанавливает соответствие между шириной родителя и количеством отображаемых слайдов
     */
    fitWidth() { // Метод для установления соответствия между шириной родителя и количеством отображаемых слайдов
        let maxSize = [0, 0];
        for (let key in this.amountImg) {
            let size = this.amountImg[key];
            if (size >= maxSize[0]) {
                maxSize[0] = size;
                maxSize[1] = key;
            }
        }

        if (this.getWidthWrapper() > maxSize[0]) {
            this.getWidthImg(maxSize[1]);
            this.currentAmountImg = maxSize[1];
            return;
        }

        for (let key in this.amountImg) {
            if (this.getWidthWrapper() <= this.amountImg[key]) {
                this.getWidthImg(key);
                this.currentAmountImg = key;
                break;
            }
        }
    }

    /**
     * Возвращает ширину обёртки.
     * @return {namber} Ширина обёртки.
     */
    getWidthWrapper() { // Метод для полученя ширины родителя
        return this.wrapper.offsetWidth;
    }

    /**
     * Устанавливает соответствие между сдвигам карусели и точкой.
     */
    setObjectForShiftDots() {
        let object = {};
        for (let i = 1; i < this.amountDots + 1; i++) {
            object[i] = i * (this.getWidthWrapper() + this.margin);
        }
        object[this.amountDots + 1] = Math.abs(this.getLastPositionCarousel());
        this.objectForShiftDots = object;
    }

    /**
     * Создает массив координат для автоматического сдвига до следующего иди предыдущего слайда.
     */
    setArrayForNav() {
        this.arraytForNav = [];
        let start = this.getStartPositionCaroisel();

        for (let i = 0; i < this.carousel.children.length; i++) {
            let result = i * (this.widthImg + this.margin) * -1;
            this.arraytForNav.push(Math.round(result));
        }
        this.arraytForNav.reverse();
    }


    // № 4 - СОЗДАНИЕ ЭЛЕМЕНТОВ
    // ===================================================================================================

    /**
     * Создает кнопки навигации.
     */
    renderButtonSlider() { // Создание боковых управляющих кнопок
        if (this.wrapper.querySelector('div[class^="button"]')) return;
        for (let i = 1; i < 3; i++) {
            let elem = document.createElement('div');
            elem.classList.add(`button-${i}`);
            this.wrapper.appendChild(elem);
        }
    }

    /**
     * Создает навигационные точки.
     */
    renderDots() { // Создание навигационных точек
        let result = this.wrapper.querySelector('.boxDots');
        if (result) this.wrapper.removeChild(result);

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

    /**
     * Создаёт клонов.
     */
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


    // № 5 - АВТОМАТИЧЕСКОЕ ПЕРЕКЛЮЧЕНИЕ СЛАЙДЕРА
    // ===================================================================================================

    /**
     * Автоматически пролистывает слайды через определенное время.
     * @param {string} status - Необходимое состояние метода.
     * play - запускает setInterval
     * stop - останавливает setInterval
     * reset - останавливает setInterval и вновь запускает.
     */
    autoPlay(status) {
        let time = this.autoPlayTime;
        if (!time) return;

        if (status == 'play') {
            clearInterval(this.timeId);
            this.timeId = setInterval(bind(function func() {
                this.right();
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


    // № 6 - ЗАПУСК СЛАЙДЕРА
    // ===================================================================================================

    /**
     * Подготавливает слайдер к работе, запуская необходимые методы в определенном порядке.
     */
    start() {
        this.fitWidth();
        this.setWidthImg();
        this.setWidthCarousel();
        this.renderButtonSlider();
        this.renderDots();
        this.addClone();
        this.getStartPositionCaroisel();
        this.setPositionCarousel();
        this.setObjectForShiftDots();
        this.getActiveDots();
        this.autoPlay('play');
        this.setArrayForNav();
    }
}

let slider = new Slider({
    wrapper: document.getElementById("slider"), // Родительские элемент слайдера.
    carousel: document.getElementsByClassName('carousel')[0], // Родитель для слайдов.
    limiter: document.getElementsByClassName('limiterForWidth')[0], // Ограничивает видимую область карусели.
    amountImage: { // Определяет отображаемое кол-во слайдов за раз, при определенном размере родителя (wrapper).
        5: 960,
        3: 850, // Если ширина wrapper < 850px, но > 500px, то отображаться будет три слайда.
        1: 500
    },
    margin: 10,
    autoPlayTime: 5000 //ms || false
});

slider.start();
