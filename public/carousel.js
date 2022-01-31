const carousel = {
    carousel : null,
    box : null,
    allimg : null,
    len : null,
    oneSize: 340,
    startPoint : 0,
    min: 0,
    max: 0,
    sum: 0, 
    left: function() {
        this.box.style.transition = '1s';  //1초에 이동하는 것처럼 이미지가 보여짐
        if (this.sum === this.max) {
            return;
        }
        this.sum += this.oneSize;
        this.box.style.transform = `translate(-${this.sum}px,0)`;

        if (this.sum === this.max) {
            setTimeout(() => {
                this.box.style.transition = 'none'; //이미지가 옮겨지는 것처럼 보이면 안됨
                this.sum = this.startPoint; //첫번째 이미지로 옮겨갈 수 있도록 첫번쨰 이미지의 위치를 넣어줌
                this.box.style.transform = `translate(-${this.sum}px,0px)`;
            }, 1000);
        }
    },
    right: function () {
        this.box.style.transition = '1s';
        if (this.sum === this.min) {
            return;
        }
    
        this.sum -= this.oneSize;
        this.box.style.transform = `translate(-${this.sum}px,0)`;
    
        if (this.sum === this.min) {
            setTimeout(function () {
                this.box.style.transition = 'none';
                this.sum = this.max - startPoint; //마지막 이미지로 옮겨져서 자연스럽게 이동되게함
                this.box.style.transform = `translate(-${this.sum}px,0px)`;
            }, 1000);
        }
    },
    init: function (className) {
        this.carousel = document.querySelector(className);
        this.box = this.carousel.querySelector('.box');
        this.setColors();
    },
    colorTemplate: function(x) {
        return `<img src="/${x.type}/${x.image}"></img>`;
    },

    setColors: async function () {
        const carouselImg = (await axios.get(`/items/carouselImg`)).data;
        let temp ='';
        for(let i = 0; i < carouselImg.length; i++) {
            temp += this.colorTemplate(carouselImg[i]);
        }
        this.box.innerHTML = temp;
        this.appendBox(this.box.querySelectorAll('img'));
        this.allimg = this.box.querySelectorAll('img');
        this.len = this.allimg.length;
        this.startPoint = this.oneSize * 4;
        this.box.style.transform = `translate(-${this.startPoint}px,0px)`;
        this.max = (this.len - 4) * this.oneSize;
        this.startPoint = this.oneSize * 4;
        this.sum = this.startPoint;
        this.carousel.querySelector('.prev').addEventListener('click', () => {
            this.left();
        });

        this.carousel.querySelector('.next').addEventListener('click', () => {
            this.right();
        })

        setInterval(() => {
            this.left();
        }, 3000);
    },
    
    firstNodes: function(img) {  //맨 뒤에 처음 4개의 이미지 삽입
        for (let i = 0; i < 4; i++) { 
           this.box.append(img[i].cloneNode(true));
        }
    },
    lastNodes: function (img) {  //맨 처음에 마지막 4개의 이미지를 삽입
        for (let i = img.length - 1; i > img.length - 5; i--) {
            let firstNode = this.box.firstElementChild;
            //console.log(firstNode);
            this.box.insertBefore(img[i].cloneNode(true), firstNode)
        }
    },
    appendBox: function (img) {
        this.firstNodes(img);
        this.lastNodes(img);
    },
}