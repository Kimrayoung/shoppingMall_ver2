// const { default: axios } = require("axios");
const paging = {
    login: null,
    page: null,
    products: null,
    totalPage: 0,
    onePage: 12,
    pageSize: 10,
    result: [],
    totalItem: 0,
    currentPage: 1,
    nowclick: null,
    userid: null,
    setUserId: async function(className) {
        this.login = document.querySelector(className);
        this.userid = (await axios.get('/users/getuserid')).data;
        this.login.addEventListener('click',async function(event) {
            if(this.userid.length !== 0) {
                if(confirm('로그아웃을 하시겠습니까?') === true) {
                    const target = event.target;
                    target.href = '/users/logout';
                    //여기서 헷갈렸던 점 --> target.href를 통해서 경로를 변경하면 경로가 바뀌는 줄 알았음
                    //js에서 html의 경로를 바꿔서 if문이 실행될때만 순간적으로 바뀌지 
                    //js파일에서 영구적으로 html을 바꿀 수는 없음
                    //원래 쓰인 html파일을 변경하려면 server쪽 템플릿을 통해서 변경하던가 html파일 자체를 변경해야 함
                } else {
                    event.preventDefault();
                    console.log('로그아웃 안함');
                }
            } 
        }.bind(this)); 
    },
    setPageTarget: function (className) {
        this.page = document.querySelector(className);
    },
    setProductTarget: function (className) {
        this.products = document.querySelector(className);
    },

    init: async function (type) {
        //this.userpk = (await axios.get('users/getuserpk')).data;
        // this.result = await axios.get(`/items/page/${this.currentPage}`);  //페이지에 해당하는 아이템만 가져오기
        this.totalItem = (await axios.get(`/items/${type}`)).data[0].itemsCount; //데이터 개수 가져오는 것\
        this.totalPage = Math.ceil(this.totalItem / this.onePage);
        this.currentPage = 1;
        this.makePageNum(1);  //처음 페이지 만들어주기
        this.makePage(type); //처음 페이지 만들어주기
        this.page.addEventListener('click', (event) => {
            console.log('click',event);
            let target = event.target;  //내가 누른 페이지
            if (target.className === 'page') {
                return;
            }
            
            if (target.textContent === '이전') {
                this.currentPage = Number(target.nextSibling.textContent) - 1;  //11이면
            } else if (target.textContent === '다음') {
                this.currentPage = Number(target.previousSibling.textContent) + 1;  //10이면
            } else {
                this.currentPage = Number(target.textContent);
            }
            this.makePageNum(this.currentPage);

            this.makePage(type);  //페이지를 만들어줌
            //type을 누를때 type이 management.js에서 넘어옴
            //그리고 새롭게 type이 누를 때까지 type을 가지고 있음
        });

        this.products.addEventListener('click',async function(event){
            const target = event.target;
            const id = Number(event.path[3].dataset.id);  //product의 id
            //const name = event.path[3].childNodes[3].innerHTML;
            
            let src = [];
            if(target.classList.contains('heart')) {
                src = target.src.split('/');
                // console.log('id확인',id);
                if(src[src.length - 1] === 'heart.png'){
                    target.src = '../img/redheart.png';
                    this.clickedEmptyHeart(id);
                    // userpk.length !== 0 ? await axios.get(`items/putheart/${userpk}/${id}`) : setLocalstorage(id);
                }else if(src[src.length - 1] === 'redheart.png'){
                    target.src = '../img/heart.png';
                    // userpk.length !== 0 ? await axios.get(`items/deleteheart/${userpk}/${id}`) : deleteLocalstorage(id);
                    this.clickedRedHeart(id);
                }
            }
        }.bind(this));
    },
    clickedEmptyHeart: async function (id)  {  //여기서 받는 id는 product의 id
        // console.log('userpk 확인하기',this.userpk);
        const data = [{
            id : id
        }]
        console.log('click empty heart data',data);
        if(this.userid.length !== 0) {
            await axios.post(`items/putheart`, {
                data : JSON.stringify(data)
                // data: data
            });            
        } else {
            setLocalstorage(data);
        }
    }, 
    clickedRedHeart: async function (id) {
        const data = [{
            id : id
        }]
        // console.log('userpk 확인하기',this.userpk);
        if(this.userid.length !== 0) {
            await axios.get(`items/deleteheart/${this.userid}/${data}`);
        } else {
            deleteLocalstorage(data);
        }
    },
    buttonTemplate: function (x) {
        return `<button class="pagenum" type="button">${x}</button>`;
    },
    currentButtonTemplate: function (x) {
        return `<button class="pagenum current" type="button">${x}</button>`;
    },
    
    makePageNum: function (currentPage = 1) {
        let firstPage = (currentPage % this.pageSize === 0) ? currentPage - this.pageSize + 1 : (Math.floor(currentPage / this.pageSize)) * this.pageSize + 1;
        let lastPage = firstPage + this.pageSize;

        if (lastPage > this.totalPage) {
            lastPage = this.totalPage;
        }

        const tempButton = [];//페이지 목록을 담아줄 배열
        if (firstPage > this.pageSize) {  //즉 이전이 필요하면 항상 pageSize보다 크므로 이전을 넣어줌
            tempButton.push(this.buttonTemplate('이전'));
        }

        for (let i = firstPage; i <= lastPage; i++) {
            if (i === currentPage) {
                tempButton.push(this.currentButtonTemplate(i));
            } else {
                tempButton.push(this.buttonTemplate(i));
            }
        }

        if (lastPage < this.totalPage) {  //보여지는 페이지의 목록의 마지막이 전체 페이지보다 적으면 다음이 필요
            tempButton.push(this.buttonTemplate('다음'));
        }
        this.page.innerHTML = tempButton.join('');
    },
    makePage: async function (items) {
        this.products.textContent = '';
        let temp = '';
        if(items === undefined) {
            items = 'all';
        }
        
        this.result = await axios.get(`/items/page/${this.currentPage}?type=${items}`);
        let heart_items = [];
        let temparr = [];
        // let filterArr = [];
        if(this.login.textContent === '로그인') {
            heart_items = getLocalstorage();
        } else {
            temparr = (await axios.get(`items/${this.userid}/heart`)).data;
            heart_items = temparr.map(x => Number(x.product_id));
        }
        // console.log('heart_items',heart_items);

        for (let i = 0; i < this.result.data.length; i++) {
            if (this.result.data[i] !== undefined) {
                const data = this.result.data[i];
                let color = data.colors;
                let colorTemp = '';
                color = color.split('/');
                colorTemp += colorTemplate(color);
                if(heart_items === null || !heart_items.includes(data.id)){
                    temp += productTemplate(data,'heart.png',colorTemp);
                }else {
                    temp += productTemplate(data,'redheart.png',colorTemp);
                }
                
            }
        }

        this.products.innerHTML = temp;
    },
}
