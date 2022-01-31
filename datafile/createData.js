//test Data 생성하는 부분
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const conn = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'shopping_mall'
}

function changetxt(file) {
    //const arr = (fs.readFileSync(`${file}.txt`,'utf8')).split(/\r?\n/);
    const arr = (fs.readFileSync(path.resolve(__dirname, `${file}.txt`),'utf8')).split(/\r?\n/);
    return arr;
}

function changelist(file) {
    const arr = fs.readdirSync(`./${file}`);
    return arr;
}
//여기에 있는 것들을 이렇게 올려도 되는 건지
//파일 리스트를 가져와서 배열에 넣는 형식으로 올리고 있는데 이렇게 해도 되는건지
//음 아닌가,,,

const onepieceData = changetxt('onepieces');
const bottomData = changetxt('bottoms');
const topData = changetxt('tops');
const priceData = changetxt('price');
const bottomSize = changetxt('bottomsize');
const topSize = changetxt('topsize');
const onepieceImg = changelist('onepiece');
const topImg = changelist('top');
const bottomImg = changelist('bottom');

function random(arr) {
    return arr[Math.trunc(Math.random() * arr.length)];
}

function randomRange(min, max) { //색깔 차트표에서 랜덤으로 숫자 뽑기
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.trunc(Math.random() * (max - min)) + min;
}

function getRandomcolor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function makeData(data,type,imges) {
    const itemSet = {
        nameValue : random(data),
        priceData : random(priceData),
        topSizeValue : '',
        itemtype : type,
        colors : '',
        img : random(imges)
    }
    let sizetemp = [];
    let colortemp = [];
    for(let i = 0; i < 3; i++) {
        if(!sizetemp.includes(random(topSize))) {
            sizetemp.push(random(topSize));
        }else {
            i--;
        }
    }
    //오름차순 정렬을 하려고 했지만 숫자가 문자로 들어가 있음 그래서 일단 정렬 x
    itemSet.topSizeValue = sizetemp.join('/');
    const colorPiece = randomRange(2,7);
    for(let i = 0; i < colorPiece; i++) {
        if(!colortemp.includes(getRandomcolor())) {
            colortemp.push(getRandomcolor());
        }else {
            i--;
        } 
    }
    itemSet.colors = colortemp.join('/');
    return itemSet;
}

function makeitems(onepieceData,type,onepieceImg) {
    const connection = mysql.createConnection(conn);
    connection.connect();
    const item = makeData(onepieceData,type,onepieceImg);

    const sql = `insert into shopping_mall.items (name, size, type, price, colors, image) values ('${item.nameValue}','${item.topSizeValue}','${item.itemtype}',${item.priceData},'${item.colors}','${item.img}');`;

    connection.query(sql, function(err, result, fields) {
        if(err) {
            console.log('insert item err',err);
        }
        connection.end();
    });
}
for(let i = 0; i < 10; i++) {
    makeitems(onepieceData,'onepiece',onepieceImg);
}
for(let i = 0; i < 10; i++) {
    makeitems(topData,'top',topImg);
}
for(let i = 0; i < 10; i++) {
    makeitems(bottomData,'bottom',bottomImg);
}
