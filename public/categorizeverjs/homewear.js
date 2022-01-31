const products = document.querySelector('.products');
const colors = ['75C5F9','38E0BB','34F54E','A5E03F','FFEB59','237BF9','237B6A'];

function randomRange(min, max) { //색깔 차트표에서 랜덤으로 숫자 뽑기
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.trunc(Math.random() * (max - min)) + min;
}

function randomRGB(rRange = [0, 256], gRange = [0, 256], bRange = [0, 256]) {  //랜덤 색깔 추출
    const r = randomRange(...rRange); // randomRange(0, 256);
    const g = randomRange(...gRange);
    const b = randomRange(...bRange);

    return `rgb(${r}, ${g}, ${b})`;
}

function inputColor(colorsEl) {
    for (let i = 0; i < colorsEl.length; i++) {
        const colors = colorsEl[i];
        const pieceCount = randomRange(1, 8);

        for (let j = 0; j < pieceCount; j++) {
            const rgbColorText = randomRGB();

            const span = document.createElement('span');
            span.style.backgroundColor = rgbColorText;

            colors.appendChild(span);
        }
    }
}


function productTemplate(data) {
    return `<div class="product">
                <div class="img_item">
                    <img src="https://via.placeholder.com/320x380/FBEFDB.png" class="pimg">
                    <img src="https://via.placeholder.com/70X23/FAEB65.png" class="sale">
                    <div class="overlay">
                        <img src="../img/heart.png">
                        <img src="../img/shopping-bag.png" class="bag">
                        <img src="../img/search.png">
                    </div>
                </div>

                <h4>${data.name}</h4>
                <div class="value">${data.price}</div>
                <div class="size">${data.size}</div>
                <div class="discription">부담 없이 입기 좋은 A라인n 데님</div>
                <div class="colors"></div> 
            </div>`
}

//로컬스토리지에 아이템을 저장하고 페이지를 만들때 로컬스토리지에서
//페이지에 해당하는 아이템들만 가져옴
function init() {
    paging.setUserId('.login_text');
    paging.setPageTarget('.page');
    paging.setProductTarget('.products');
    paging.init();
    carousel.init('.container',colors);
}
init();
