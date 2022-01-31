function setLastKey() {
    const key = getLastKey() + 1;
    console.log('lastkey',key);
    localStorage.setItem('lastKey',key);
}

function getLastKey(){
    let key = localStorage.getItem('lastKey'); //저장되어 있는 lastKey가 있다면 HTML을 처음에 생성할 때 가져옴
    if(key === null){
        key = 0;
    }

    return Number(key);
}

function setStorage(result) {
    localStorage.setItem('items',JSON.stringify(result));
}

function getStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}