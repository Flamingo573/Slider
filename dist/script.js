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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    /**
     * Конструктор Slider создает все необходимое для рабыты слайдера.
     * В качестве "слайдов" принимает любые элементы.
     * @param {object} options - Содержит: элементы, отступ, желаемое кол-во отображаемых за раз элементов,
     *  время между автоматическим переключением слайдов.
     */
    function Slider(options) {
        _classCallCheck(this, Slider);

        this.wrapper = options.wrapper;
        this.limiter = options.limiter;
        this.margin = options.margin;
        this.amountImg = options.amountImage;
        this.carousel = options.carousel;
        this.activeDot = 0;
        this.autoPlayTime = options.autoPlayTime;

        this.bindMove = bind(this.eventMove, this);
        this.bindUp = bind(this.eventUp, this);

        this.widthBody = document.body.offsetWidth;

        this.carousel.ondragstart = function () {
            return false;
        };

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


    _createClass(Slider, [{
        key: 'listenerEvent',
        value: function listenerEvent(event) {
            if (event.type == 'resize') {
                if (this.widthBody < document.body.offsetWidth || this.widthBody > document.body.offsetWidth) {
                    this.widthBody = document.body.offsetWidth;

                    this.start();
                }
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

    }, {
        key: 'left',
        value: function left() {
            this.autoPlay('reset');
            this.carousel.style.transition = 'transform 500ms';

            this.count += this.widthImg + this.margin;
            if (Math.round(this.count) > -this.getWidthWrapper()) this.endCarousel('left');
            this.setPositionCarousel();
            this.getActiveDots();
        }

        /**
         * Пролистывает один слайд в право
         */

    }, {
        key: 'right',
        value: function right() {
            this.autoPlay('reset');
            this.carousel.style.transition = 'transform 500ms';

            this.count -= this.widthImg + this.margin;
            if (Math.round(this.count) < this.getLastPositionCarousel()) this.endCarousel('right');
            this.setPositionCarousel();
            this.getActiveDots();
        }

        /**
         * Обрабатывает нажатие по навигационным точкам.
         */

    }, {
        key: 'selectedDot',
        value: function selectedDot(target) {
            this.carousel.style.transition = 'transform 250ms';
            this.autoPlay('reset');

            var index = target.getAttribute('data-index');
            this.count = -index * (this.getWidthWrapper() + this.margin);
            this.setPositionCarousel();

            this.activeDot = index - 1;
            this.setActiveDot();
        }

        /**
         * Обрабатывает событие mousedown.
         */

    }, {
        key: 'eventDown',
        value: function eventDown(event) {
            var _dragObj;

            this.autoPlay('stop');
            this.carousel.style.transition = '';
            this.wrapper.classList.add('grab');

            var count = this.count,
                startCoord = this.getCoordX(event),
                coordMove = 0;

            this.dragObj = (_dragObj = {
                startCoord: this.getCoordX(event),
                count: this.count,
                coordMove: 0
            }, _defineProperty(_dragObj, 'coordMove', 0), _defineProperty(_dragObj, 'swipePlay', false), _dragObj);

            this.controlEventListener(event);
        }

        /**
         * Обрабатывает событие mousemove.
         */

    }, {
        key: 'eventMove',
        value: function eventMove(event) {
            this.dragObj.swipePlay = true;

            this.dragObj.coordMove = this.getCoordX(event) || 1;

            this.count = this.dragObj.count - (this.dragObj.startCoord - this.dragObj.coordMove);

            var leftEnd = Math.round(-this.getWidthWrapper() - this.margin);
            var rightEnd = Math.round(this.getLastPositionCarousel());

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

    }, {
        key: 'eventUp',
        value: function eventUp(event) {
            this.controlEventListener(event);
            this.wrapper.classList.remove('grab');

            if (!this.dragObj.swipePlay) return;

            this.carousel.style.transition = 'transform 250ms';

            var startPos = void 0,
                i = void 0,
                diff = void 0;

            for (i = 0; i < this.arraytForNav.length; i++) {
                if (this.count <= this.arraytForNav[i]) {
                    startPos = this.arraytForNav[i];
                    break;
                }
            }

            if (this.dragObj.startCoord - this.dragObj.coordMove > 0) {
                diff = Math.abs(this.count - startPos);

                if (diff > 70) this.count = this.arraytForNav[i - 1];else this.count = this.arraytForNav[i];
            }

            if (this.dragObj.startCoord - this.dragObj.coordMove < 0) {
                diff = Math.abs(this.count - this.arraytForNav[i - 1]);

                if (diff > 70) this.count = this.arraytForNav[i];else this.count = this.arraytForNav[i - 1];
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

    }, {
        key: 'endCarousel',
        value: function endCarousel(side) {
            this.carousel.style.transition = '';
            this.count = side == 'left' ? this.getLastPositionCarousel() : this.getStartPositionCaroisel();
            this.setPositionCarousel();
            side == 'left' ? setTimeout(bind(this.left, this), 10) : setTimeout(bind(this.right, this), 10);
        }

        /**
         * Возвращает  крайнюю позицию карусели
         * @return {namber} Конечный сдвиг карусели.
         */

    }, {
        key: 'getLastPositionCarousel',
        value: function getLastPositionCarousel() {
            return -this.widthCarousel + this.getWidthWrapper() + this.margin;
        }

        /**
         * Возвращает  начальную позицию карусели, задает свойство count.
         * @return {namber} Начальный сдвиг карусели.
         */

    }, {
        key: 'getStartPositionCaroisel',
        value: function getStartPositionCaroisel() {
            this.count = -this.getWidthWrapper() - this.margin;
            return this.count;
        }

        /**
         * Устанавливает ширину карусели.
         */

    }, {
        key: 'setPositionCarousel',
        value: function setPositionCarousel() {
            this.carousel.style.transform = 'translateX(' + this.count + 'px)';
        }

        /**
         * Обновляет свойство activeDot в котором содержится индекс активной точки.
         */

    }, {
        key: 'getActiveDots',
        value: function getActiveDots() {
            var count = Math.abs(Math.round(this.count));

            if (Math.round(this.count) <= this.getLastPositionCarousel()) {
                this.activeDot = 0;
                this.setActiveDot();
                return;
            }

            for (var i = this.amountDots + 1; i != 0; i--) {
                var result = count >= this.objectForShiftDots[i] && count <= this.objectForShiftDots[i + 1];
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

    }, {
        key: 'setActiveDot',
        value: function setActiveDot() {
            for (var i = 0; i < this.amountDots; i++) {
                this.boxDots.children[i].classList.remove('active');
            }
            this.boxDots.children[this.activeDot].classList.add('active');
        }

        /**
         * Возвращает координату мыши по x, в зависимости от типа события.
         * @return {namber} Координата x.
         */

    }, {
        key: 'getCoordX',
        value: function getCoordX(event) {
            if (event.type == 'mousedown' || event.type == 'mousemove') {
                return event.pageX;
            }

            if (event.type == 'touchstart' || event.type == 'touchmove') {
                return event.touches[0].pageX;
            }
        }

        /**
         * Назначает или удаляет обработчик, в зависимости от типа события.
         */

    }, {
        key: 'controlEventListener',
        value: function controlEventListener(event) {
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

    }, {
        key: 'getWidthImg',
        value: function getWidthImg(amount) {
            this.widthImg = (this.getWidthWrapper() - this.margin * (amount - 1)) / amount;
        }

        /**
         * Устанавливает ширину и отступ каждому слайду.
         */

    }, {
        key: 'setWidthImg',
        value: function setWidthImg() {
            for (var i = 0; i < this.carousel.children.length; i++) {
                var elem = this.carousel.children[i];
                elem.style.width = this.widthImg + 'px';
                elem.style.marginRight = this.margin + 'px';
            }
        }

        /**
         * Устанавливает ширину карусели.
         */

    }, {
        key: 'setWidthCarousel',
        value: function setWidthCarousel() {
            this.widthCarousel = this.carousel.children.length * (this.widthImg + this.margin);
            this.carousel.style.width = this.widthCarousel + 'px';
        }

        // 3.2 - Вспомогательные методы
        // =========================================

        /**
         * Устанавливает соответствие между шириной родителя и количеством отображаемых слайдов
         */

    }, {
        key: 'fitWidth',
        value: function fitWidth() {
            // Метод для установления соответствия между шириной родителя и количеством отображаемых слайдов
            var maxSize = [0, 0];
            for (var key in this.amountImg) {
                var size = this.amountImg[key];
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

            for (var _key in this.amountImg) {
                if (this.getWidthWrapper() <= this.amountImg[_key]) {
                    this.getWidthImg(_key);
                    this.currentAmountImg = _key;
                    break;
                }
            }
        }

        /**
         * Возвращает ширину обёртки.
         * @return {namber} Ширина обёртки.
         */

    }, {
        key: 'getWidthWrapper',
        value: function getWidthWrapper() {
            // Метод для полученя ширины родителя
            return this.wrapper.offsetWidth;
        }

        /**
         * Устанавливает соответствие между сдвигам карусели и точкой.
         */

    }, {
        key: 'setObjectForShiftDots',
        value: function setObjectForShiftDots() {
            var object = {};
            for (var i = 1; i < this.amountDots + 1; i++) {
                object[i] = i * (this.getWidthWrapper() + this.margin);
            }
            object[this.amountDots + 1] = Math.abs(this.getLastPositionCarousel());
            this.objectForShiftDots = object;
        }

        /**
         * Создает массив координат для автоматического сдвига до следующего иди предыдущего слайда.
         */

    }, {
        key: 'setArrayForNav',
        value: function setArrayForNav() {
            this.arraytForNav = [];
            var start = this.getStartPositionCaroisel();

            for (var i = 0; i < this.carousel.children.length; i++) {
                var result = i * (this.widthImg + this.margin) * -1;
                this.arraytForNav.push(Math.round(result));
            }
            this.arraytForNav.reverse();
        }

        // № 4 - СОЗДАНИЕ ЭЛЕМЕНТОВ
        // ===================================================================================================

        /**
         * Создает кнопки навигации.
         */

    }, {
        key: 'renderButtonSlider',
        value: function renderButtonSlider() {
            // Создание боковых управляющих кнопок
            if (this.wrapper.querySelector('div[class^="button"]')) return;
            for (var i = 1; i < 3; i++) {
                var elem = document.createElement('div');
                elem.classList.add('button-' + i);
                this.wrapper.appendChild(elem);
            }
        }

        /**
         * Создает навигационные точки.
         */

    }, {
        key: 'renderDots',
        value: function renderDots() {
            // Создание навигационных точек
            var result = this.wrapper.querySelector('.boxDots');
            if (result) this.wrapper.removeChild(result);

            var boxElem = document.createElement('div');
            boxElem.classList.add('boxDots');

            var amountDots = Math.ceil((this.carousel.children.length - this.carousel.querySelectorAll('.clone').length) / this.currentAmountImg);

            for (var i = 0; i < amountDots; i++) {
                var elem = document.createElement('div');
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

    }, {
        key: 'addClone',
        value: function addClone() {
            var _this = this;

            // Создает дополнительные элементы
            var result = this.carousel.getElementsByClassName('clone');
            if (result.length) {
                for (var i = 0; i < result.length; i++) {
                    this.carousel.removeChild(result[i]);
                    i--;
                }
            }

            var cloneInStart = [];
            var cloneInEnd = [];

            for (var _i = this.carousel.children.length - 1; _i > this.carousel.children.length - 1 - this.currentAmountImg; _i--) {
                var elem = this.carousel.children[_i].cloneNode(true);
                elem.classList.add('clone');
                cloneInStart.push(elem);
            }

            for (var _i2 = 0; _i2 < this.currentAmountImg; _i2++) {
                var _elem = this.carousel.children[_i2].cloneNode(true);
                _elem.classList.add('clone');
                cloneInEnd.push(_elem);
            }

            cloneInStart.forEach(function (item) {
                return _this.carousel.insertBefore(item, _this.carousel.firstChild);
            });
            cloneInEnd.forEach(function (item) {
                return _this.carousel.appendChild(item);
            });

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

    }, {
        key: 'autoPlay',
        value: function autoPlay(status) {
            var time = this.autoPlayTime;
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

    }, {
        key: 'start',
        value: function start() {
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
    }]);

    return Slider;
}();

var slider = new Slider({
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
