'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    function Slider(options) {
        _classCallCheck(this, Slider);

        this.img = options.img;
        this.wrapper = options.wrapper;
        this.count = 0;

        this.wrapper.addEventListener('click', bind(this.listenerClick, this));
    }

    _createClass(Slider, [{
        key: 'listenerClick',
        value: function listenerClick(event) {
            if (event.target.closest('div[class^="button"]')) {
                if (event.target.className == "button-1") this.left();else this.right();
            }

            if (event.target.closest('div[class^="dot"]')) {
                var selectedDot = event.target.className.split(' ')[0];

                this.count = +selectedDot.charAt(selectedDot.length - 1) - 1;

                this.setMainImg();
                this.setActiveDot();
            }
        }
    }, {
        key: 'renderSlider',
        value: function renderSlider() {
            var elem = document.createElement('img');
            elem.src = this.img[this.count];
            this.wrapper.appendChild(elem);
            this.mainImg = elem;
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
                elem.classList.add('dot-' + i);
                boxElem.appendChild(elem);
            }
            boxElem.children[this.count].classList.add('active');
            this.wrapper.appendChild(boxElem);
            this.boxElem = boxElem;
        }
    }, {
        key: 'left',
        value: function left() {
            this.count--;
            if (this.count < 0) this.count = this.img.length - 1;

            this.setMainImg();
            this.setActiveDot();
        }
    }, {
        key: 'right',
        value: function right() {
            this.count++;
            if (this.count > this.img.length - 1) this.count = 0;

            this.setMainImg();
            this.setActiveDot();
        }
    }, {
        key: 'setMainImg',
        value: function setMainImg() {
            this.mainImg.src = this.img[this.count];
        }
    }, {
        key: 'setActiveDot',
        value: function setActiveDot() {
            for (var i = 0; i < this.img.length; i++) {
                this.boxElem.children[i].classList.remove('active');
            }

            this.boxElem.children[this.count].classList.add('active');
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
        }
    }]);

    return Slider;
}();

var slider = new Slider({
    img: ["image/img-1.jpg", "image/img-2.jpg", "image/img-3.jpg", "image/img-4.jpg", "image/img-5.jpg", "image/img-6.jpg", "image/img-7.jpg"],
    wrapper: document.getElementById("slider")
});

slider.start();

console.dir(slider);