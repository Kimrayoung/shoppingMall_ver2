const container = document.querySelector('.products');
const storeButton = document.querySelector('.modal_store');
const modalModify = document.querySelector('.modal_modify');

let idElem = modalModify.querySelector('#id');
let nameElem = modalModify.querySelector('#name');
let sizeElem = modalModify.querySelector('#size');
let typeElem = modalModify.querySelector('#type');
let priceElem = modalModify.querySelector('#price');
let colorsElem = modalModify.querySelector('#colors');
let imagElem = modalModify.querySelector('#image');

//페이지 그려주기
function productTemplate(data) {   
    return `<div class="product product-${data.id}" data-key="${data.id}">
                        <div class="content">${data.name} ${data.size} ${data.type} ${data.price} ${data.colors} ${data.image}</div>
                        <div class="content-btns">
                            <button class="modify">수정</button>
                            <button class="delete">삭제</button>
                        </div>
                    </div>`     
}
const navbar = document.querySelector('.navbar');
const all = document.querySelector('.all');
const onepiece = document.querySelector('.onepiece');
const tops = document.querySelector('.top');
const bottom = document.querySelector('.bottom');

navbar.addEventListener('click',function(event){
    const target = event.target.textContent;
    console.log('target 누른것',target);

    clickedtype(target);
})

async function clickedtype(type){
    paging.init(type);
}

//추가,삭제,수정버튼
let count;
const add = document.querySelector('.add');
add.addEventListener('click', async function () {
    modalModify.style.visibility = 'visible';

});

let data;
async function modifyProduct(key) {
    console.log('modify key',key);    
    const result = await axios.get(`items/management/modify/${key}`);
    // 왜 아래처럼하면 안되는 이유
    //const result = await axios.get('items/management/modify', { params: {key : `${key}`} });
    data = result.data[0];
    
    console.log('db에서 가져온 값 확인',result);

    idElem.value = key;
    nameElem.value = data.name;
    sizeElem.value = data.size;
    typeElem.value = data.type;
    priceElem.value = data.price;
    colorsElem.value = data.colorsElem;
    imagElem.value = data.imagElem;
    modalModify.style.visibility = 'visible';
    console.log('modify에서 item을 넣은 후', nameElem.value, sizeElem.value, typeElem.value,);
}


storeButton.addEventListener('submit', async function (event) {
    
    modalModify.style.visibility = 'hidden';
    idElem.value = '';
    nameElem.value = '';
    sizeElem.value = '';
    typeElem.value = '';
    priceElem.value = '';
    colorsElem.value = '';
    imagElem.value = '';

    paging.makePage();
});



//삭제 버튼 누르면 해당 목록을 localstorage에서 삭제 후 페이지를 다시 만들어줘야 함
async function deleteProduct(key) {
    await axios.delete(`/items/management/delete/${key}`);
    paging.makePage();
}

//modify랑 delete를 눌렀을 때(이벤트 계승)

container.addEventListener('click', function (event) {
    let target = event.target;

    if (target.nodeName !== 'BUTTON') {
        return;
    }

    const key = Number(target.parentNode.parentNode.dataset.key);  //삭제할 번호

    if (target.classList.contains('delete')) {
        deleteProduct(key);
    } else if (target.classList.contains('modify')) {
        modifyProduct(key);
    }
});

function init() {
    paging.setPageTarget('.page');
    paging.setProductTarget('.products');
    paging.init('all');//처음 페이지를 만들어줄때는 전체 데이터를 다 보여줌
}
init();
