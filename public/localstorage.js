function setLocalstorage(data) { 
    let arr = getLocalstorage();
    if(arr === null) {
        arr = [data[0].id]
        localStorage.setItem('items',JSON.stringify(arr));
        return;
    }
    for(let i = 0; i < data.length; i++) { //물론 한번에 들어오는 데이터가 하나겠지만 만약에 데이터가 하나가 아닐경우
        //하나일 경우에는 이 반복문이 한번만 돌거니까 상관없음
        arr.push(data[i].id);
    }
    localStorage.setItem('items',JSON.stringify(arr));
}

function getLocalstorage() {
    const arr = JSON.parse(localStorage.getItem('items'));
    return arr;
}

function deleteLocalstorage(data) {
    const arr = getLocalstorage();
    const temp = arr.map(x => x.id);
    const index = temp.indexOf(data.id);
    arr.splice(index,1);
    console.log('arr확인',arr)
    localStorage.setItem('items',JSON.stringify(arr));
}

function deletAllLocalstorage() {
    localStorage.clear();
}