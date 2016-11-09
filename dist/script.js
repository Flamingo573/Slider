'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    function Slider(options) {
        _classCallCheck(this, Slider);

        this.wrapper = options.wrapper;
        this.limiter = options.limiter;
        this.margin = options.margin;
        this.amountImg = options.amountImage;
        this.carousel = options.carousel;
        this.activeDot = 0;
        this.autoPlayTime = options.autoPlayTime;

        this.carousel.ondragstart = function () {
            return false;
        };

        this.wrapper.addEventListener('click', bind(this.listenerEvent, this));
        this.wrapper.addEventListener('mousedown', bind(this.listenerEvent, this));
        window.addEventListener('resize', bind(this.listenerEvent, this));
        this.limiter.addEventListener('touchstart', bind(this.listenerEvent, this));
        this.limiter.addEventListener('mousedown', bind(this.listenerEvent, this));
    }

    // УСТАНОВКА ПЕРВОНАЧАЛЬНЫХ РАЗМЕРОВ И ОТСТУПОВ
    // ===================================================================================================

    _createClass(Slider, [{
        key: 'fitWidth',
        value: function fitWidth() {
            // Метод для установления соответствия между шириной родителя и количеством отображаемых слайдов
            for (var key in this.amountImg) {
                if (this.getWidthWrapper() <= this.amountImg[key]) {
                    this.getWidthImg(key);
                    this.currentAmountImg = key;
                    break;
                }
            }
        }
    }, {
        key: 'getWidthWrapper',
        value: function getWidthWrapper() {
            // Метод для полученя ширины родителя
            return this.wrapper.offsetWidth;
        }
    }, {
        key: 'getWidthImg',
        value: function getWidthImg(amount) {
            // Метод для расчета ширины слайда
            this.widthImg = (this.getWidthWrapper() - this.margin * (amount - 1)) / amount;
        }
    }, {
        key: 'setWidthImg',
        value: function setWidthImg() {
            // Метод для установки шириный и отступа слайда
            for (var i = 0; i < this.carousel.children.length; i++) {
                var elem = this.carousel.children[i];
                elem.style.width = this.widthImg + 'px';
                elem.style.marginRight = this.margin + 'px';
            }
        }
    }, {
        key: 'setWidthCarousel',
        value: function setWidthCarousel() {
            // Метод для установки ширины карусели
            this.widthCarousel = this.carousel.children.length * (this.widthImg + this.margin);
            this.carousel.style.width = this.widthCarousel + 'px';
        }
    }, {
        key: 'getStartPositionCaroisel',
        value: function getStartPositionCaroisel() {
            this.count = -this.getWidthWrapper() - this.margin;
            return this.count;
        }

        // ОБРАБОТЧИК СОБЫТИЙ
        // ===================================================================================================

    }, {
        key: 'listenerEvent',
        value: function listenerEvent(event) {
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
    }, {
        key: 'renderDots',
        value: function renderDots() {
            // Создание навигационных точек
            var result = this.wrapper.querySelector('.boxDots');
            if (result) {
                this.wrapper.removeChild(result);
            }
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

        // УПРАВЛЯЮЩИЕ МЕТОДЫ
        // ===================================================================================================

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
    }, {
        key: 'endCarousel',
        value: function endCarousel(side) {
            this.carousel.style.transition = '';
            this.count = side == 'left' ? this.getLastPositionCarousel() : this.getStartPositionCaroisel();
            this.setPositionCarousel();
            side == 'left' ? setTimeout(bind(this.left, this), 10) : setTimeout(bind(this.right, this), 10);
        }
    }, {
        key: 'getLastPositionCarousel',
        value: function getLastPositionCarousel() {
            return -this.widthCarousel + this.getWidthWrapper() + this.margin;
        }
    }, {
        key: 'setPositionCarousel',
        value: function setPositionCarousel() {
            this.carousel.style.transform = 'translateX(' + this.count + 'px)';
        }
    }, {
        key: 'selectedDot',
        value: function selectedDot(target) {
            this.autoPlay('reset');

            var index = target.getAttribute('data-index');
            this.count = -index * (this.getWidthWrapper() + this.margin);
            this.setPositionCarousel();

            this.activeDot = index - 1;
            this.setActiveDot();
        }
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
    }, {
        key: 'setActiveDot',
        value: function setActiveDot() {
            for (var i = 0; i < this.amountDots; i++) {
                this.boxDots.children[i].classList.remove('active');
            }
            this.boxDots.children[this.activeDot].classList.add('active');
        }
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
    }, {
        key: 'touchShiftSlider',
        value: function touchShiftSlider(event) {
            this.autoPlay('stop');
            this.carousel.style.transition = '';

            var count = this.count,
                startCoord = event.targetTouches[0].clientX,
                coordMove = 0;

            window.ontouchmove = bind(function (event) {

                coordMove = event.targetTouches[0].clientX;
                this.count = count - (startCoord - coordMove);

                var leftEnd = Math.round(-this.getWidthWrapper() - this.margin);
                var rightEnd = Math.round(this.getLastPositionCarousel());

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

            window.ontouchend = bind(function (event) {
                this.carousel.style.transition = 'transform 500ms';

                var shift = startCoord - (coordMove || startCoord),
                    fullShift = Math.abs(shift / this.widthImg).toFixed(2),
                    shiftIntPart = +fullShift.split('.')[0],
                    shiftFloatPart = +fullShift.split('.')[1],
                    finalShift = Math.abs(shiftFloatPart) > 25 ? Math.ceil(fullShift) : Math.floor(fullShift);

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
    }, {
        key: 'mouseShiftSlider',
        value: function mouseShiftSlider(event) {
            this.autoPlay('stop');
            this.carousel.style.transition = '';
            this.wrapper.classList.add('grab');

            var count = this.count,
                startCoord = event.clientX,
                coordMove = 0;

            window.onmousemove = bind(function (event) {

                coordMove = event.clientX || 1;
                this.count = count - (startCoord - coordMove);

                var leftEnd = Math.round(-this.getWidthWrapper() - this.margin);
                var rightEnd = Math.round(this.getLastPositionCarousel());

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

            window.onmouseup = bind(function (event) {
                this.carousel.style.transition = 'transform 500ms';

                var shift = startCoord - (coordMove || startCoord),
                    fullShift = Math.abs(shift / this.widthImg).toFixed(2),
                    shiftIntPart = +fullShift.split('.')[0],
                    shiftFloatPart = +fullShift.split('.')[1],
                    finalShift = Math.abs(shiftFloatPart) > 25 ? Math.ceil(fullShift) : Math.floor(fullShift);

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
    }, {
        key: 'autoPlay',
        value: function autoPlay(status) {
            var time = this.autoPlayTime;
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

    }, {
        key: 'start',
        value: function start() {
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
    }]);

    return Slider;
}();

var slider = new Slider({
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