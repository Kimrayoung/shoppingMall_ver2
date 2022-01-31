let login_text = document.querySelector('.login_text').textContent;

console.log('login_text',login_text);

if(getLocalstorage() !== null && login_text !== '로그인') {
    console.log('deleteAllLocalstorage');
    deletAllLocalstorage();
}

function colorTemplate(arr) {
    let temp = '';
    for(let i = 0; i < arr.length; i++) {
        temp += `<span style="background-color: ${arr[i]}"> </span>`;
    }
    return temp;
}

function productTemplate(data,heart,colorTemp) {
    return `<div class="product" data-id=${data.id}>
                <div class="img_item">
                    <img src="/${data.type}/${data.image}" class="pimg">
                    <div class="overlay">
                        <img src="../img/${heart}" class="heart">
                        <img src="../img/shopping-bag.png" class="bag">
                        <img src="../img/search.png">
                    </div>
                </div>

                <h4>${data.name}</h4>
                <div class="value">${data.price}</div>
                <div class="size">${data.size}</div>
                <div class="discription">부담 없이 입기 좋은 A라인n 데님</div>
                <div class="colors">
                    ${colorTemp}
                </div>
            </div>`
} 

//cookie 기본 함수 --> document.cookie = '쿠키이름 = 쿠키 값'
function setCookie(name, value, days) {  //cookie설정  //함수 이름, 저장할 값, 만료시간 값
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + days); //설정 일수만큼 현재시간에 만료값으로 지정

    let cookie_value = encodeURIComponent(value) + ((days === null) ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = encodeURIComponent(name) + "=" + cookie_value;
}

function getCookie(name) {  //쿠키값을 가져옴
    let x, y;
    let value = document.cookie.split(';');
    for (let i = 0; i < value.length; i++) {
        x = value[i].substr(0, value[i].indexOf('='));
        y = value[i].substr(value[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); //앞과 뒤에 공백제거

        if (x === name) {
            return decodeURIComponent(y);
        }
    }
}


const modal = document.querySelector('.modal');
console.log('modal 속성확인', modal);

modal.addEventListener('click', function (event) {
    console.log('event.path[2]', event.path[2]);
    let popup_name = event.path[2].classList[1];
    console.log('popup_name', popup_name);
    if (event.target.checked === true) {
        event.path[2].style.visibility = 'hidden';
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + 1); //설정 일수만큼 현재시간에 만료값으로 지정
        setCookie(popup_name, 'popup', 1);  //하루 뒤에 만료되는 popup 이름으로 expireday라는 값을 저장
        if (getCookie('boxs') === undefined) {
            setCookie('boxs', popup_name);
        } else {
            setCookie('boxs', getCookie('boxs') + ';' + popup_name);
        }
    }
});

function checkCookies() {
    let cookies = getCookie('boxs');
    if (cookies === undefined) {
        return;
    } else {
        cookies = cookies.split(';'); //split(';')은 잘못하면 오류가 날 수 있음 왜냐하면 쿠키는 ;공백으로 구분하기 때문
    }
    for (let i = 0; i < cookies.length; i++) {
        if (getCookie(`box${i + 1}`)) {
            document.querySelector(`.box${i + 1}`).style.visibility = 'hidden';
        }
    }
}

function init() {
    checkCookies();  //시간이 지난 모달창 있는지 확인하기
    paging.setUserId('.login_text');
    paging.setPageTarget('.page');
    paging.setProductTarget('.products');
    paging.init('all');
    carousel.init('.container');
}
init();
