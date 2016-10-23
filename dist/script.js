'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    function Slider(options) {
        _classCallCheck(this, Slider);

        this.img = options.img;
        this.wrapper = options.wrapper;
        this.count = -100;
        this.index;
        this.statusClick = true;
        this.wrapper.addEventListener('click', bind(this.listenerEvent, this));
        this.wrapper.addEventListener('transitionend', bind(this.listenerEvent, this));
    }

    _createClass(Slider, [{
        key: 'listenerEvent',
        value: function listenerEvent(event) {
            if (event.type == 'click') {
                if (event.target.classList.contains('button-1')) this.left();
                if (event.target.classList.contains('button-2')) this.right();

                if (event.target.hasAttribute('data-index')) {
                    var index = event.target.dataset.index;
                    this.count = -index * 100;
                    this.carouselImg.style.transition = 'left 700ms';
                    this.setMainImg();
                    this.setActiveDot();
                }
            }

            if (event.type == "transitionend") {}
        }
    }, {
        key: 'renderSlider',
        value: function renderSlider() {
            var limiterForWidth = document.createElement('div'),
                carouselImg = document.createElement('div');

            limiterForWidth.classList.add('limiterForWidth');
            carouselImg.classList.add('carouselImg');

            carouselImg.style.width = this.wrapper.offsetWidth * (this.img.length + 2) + 'px';

            for (var i = 0; i < this.img.length; i++) {
                var img = document.createElement('img');
                img.src = this.img[i];
                img.style.width = this.wrapper.offsetWidth + 'px';
                carouselImg.appendChild(img);
            }

            for (var _i = 0; _i < 2; _i++) {
                var _img = document.createElement('img');

                if (_i == 0) {
                    _img.src = this.img[this.img.length - 1];
                    carouselImg.insertAdjacentElement('afterBegin', _img);
                } else {
                    _img.src = this.img[0];
                    carouselImg.insertAdjacentElement('beforeEnd', _img);
                }
                _img.style.width = this.wrapper.offsetWidth + 'px';
            }

            limiterForWidth.appendChild(carouselImg);
            this.wrapper.appendChild(limiterForWidth);

            this.carouselImg = carouselImg;
        }
    }, {
        key: 'renderButtonSlider',
        value: function renderButtonSlider() {
            for (var i = 1; i < 3; i++) {
                var elem = document.createElement('div');
                elem.classList.add('button-' + i);
                this.wrapper.appendChild(elem);
            }
        }
    }, {
        key: 'renderDots',
        value: function renderDots() {
            var boxElem = document.createElement('div');
            boxElem.classList.add('boxDots');

            for (var i = 1; i < this.img.length + 1; i++) {
                var elem = document.createElement('div');
                elem.setAttribute('data-index', i);
                boxElem.appendChild(elem);
            }
            this.index = 1;
            this.wrapper.appendChild(boxElem);
            this.boxElem = boxElem;
        }
    }, {
        key: 'left',
        value: function left() {
            if (this.statusClick) {
                this.count += 100;

                this.carouselImg.style.transition = 'left 700ms';
                this.setMainImg();
                this.startShift();
                this.setActiveDot();
            }
        }
    }, {
        key: 'right',
        value: function right() {
            if (this.statusClick) {
                this.count -= 100;

                this.carouselImg.style.transition = 'left 700ms';
                this.setMainImg();
                this.startShift();
                this.setActiveDot();
            }
        }
    }, {
        key: 'startShift',
        value: function startShift() {
            this.statusClick = false;
            window.ontransitionend = bind(function () {
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
            }, this);
        }
    }, {
        key: 'getShiftInterval',
        value: function getShiftInterval() {
            return -+(this.img.length + 1 + '00');
        }
    }, {
        key: 'setMainImg',
        value: function setMainImg() {
            this.carouselImg.style.left = this.count + '%';
        }
    }, {
        key: 'setActiveDot',
        value: function setActiveDot() {
            for (var i = 0; i < this.img.length; i++) {
                this.boxElem.children[i].classList.remove('active');
            }

            var count = this.count * -1 / 100 - 1;
            if (count > this.boxElem.children.length - 1) count = 0;
            if (count < 0) count = this.boxElem.children.length - 1;

            this.boxElem.children[count].classList.add('active');
        }
    }, {
        key: 'preloadImg',
        value: function preloadImg() {
            for (var i = 0; i < this.img.length; i++) {
                var img = document.createElement("img").src = this.img[i];
            }
        }
    }, {
        key: 'start',
        value: function start() {
            this.preloadImg();
            this.renderSlider();
            this.renderButtonSlider();
            this.renderDots();
            this.setMainImg();
            this.setActiveDot();
        }
    }]);

    return Slider;
}();

var slider = new Slider({
    img: ["image/img-1.jpg", "image/img-2.jpg", "image/img-3.jpg", "image/img-4.jpg", "image/img-5.jpg", "image/img-6.jpg", "image/img-7.jpg"],
    wrapper: document.getElementById("slider")
});

slider.start();
slider.getShiftInterval();
console.dir(slider);