//items를 데이터에 넣고 저장할 db
//management에서 데이터들을 보여줄 html과 연결된 js는 따로 두고 
//management.js파일에서 get을 통해서 items.js와 통신하면서 데이터를 가져오기
const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const putheart = require('../util/temp');

// const bodyParser = require('body-parser');

let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let type = req.body.type;
            let path =  `./datafile/${type}Img`;
            callback(null,path);
        },
        filename: (req, file, callback) => {
            callback(null,file.originalname);
        }
    })
});

const conn = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'shopping_mall',
}

const router = express.Router();


//management에서n도 get을 해서 현재 저장되어 있는 데이터를 가져오고(사용하고)
//일반 파일에서도 get을 해서 현재 저장되어 있는 데이터를 가져와야 함
router.get('/carouselImg',(req, res, next) => {
    const connection = mysql.createConnection(conn);
    connection.connect();
    const sql = `select image,type from items free_board order by rand() limit 7;`;

    connection.query(sql, function(err,results, fields) {
        if(err) {
            console.log('랜덤 이미지 추출 오류',err);
        }
        res.json(results);
        connection.end();
    })
});

router.get('/page/:pageNumber',(req, res, next)=> {
    const connection = mysql.createConnection(conn);
    connection.connect();
    const pageNumber = req.params.pageNumber; //restAPI방식이므로 parmas로 해야함
    const onePage = 12;
    const type = req.query.type; //query를 붙여서 보내는 방식
    const userId = req.session.userId;
    // console.log('type',type);
    const startItemNum = (pageNumber - 1) * onePage;
    let sql;
    if(type ==='all') {
        sql = `SELECT * FROM shopping_mall.items LIMIT ${startItemNum}, ${onePage};`
    }else {
        sql = `SELECT * FROM shopping_mall.items where type = '${type}' LIMIT ${startItemNum}, ${onePage}`;
    }
    // if(userId === undefined) {
    //     if(type ==='all') {
    //         sql = `SELECT * FROM shopping_mall.items LIMIT ${startItemNum}, ${onePage} ;`
    //     }else {
    //         sql = `SELECT * FROM shopping_mall.items where type = '${type}' LIMIT ${startItemNum}, ${onePage}`;
    //     }
    // } else { //로그인이 되어있는 상태
    //     if(type ==='all') {
    //         sql = `SELECT * FROM shopping_mall.items LIMIT ${startItemNum}, ${onePage};`
    //     }else {
    //         sql = `SELECT * FROM shopping_mall.items where type = '${type}' LIMIT ${startItemNum}, ${onePage}`;
    //     }
    // }
    // console.log('pageNumber',sql);
    connection.query(sql, function(err, results, fields) {
        if(err) {
            console.log('특정 column 아이템 조회 오류',err);
        }
        res.json(results);
        connection.end();
    })
});

router.post('/putheart',(req, res, next) => {
    const data = JSON.parse(req.body.data);  //data는 배열
    console.log('req.body.data',data);
    const user_name = req.session.userId;// 이렇게 userId를 확인을 할 수는 없는지    
    const result = [];
    for(let i = 0; i < data.length; i++) {
        result.push(data[i].id);
    }

    putheart(result, user_name, function(err, result, fields) {
        if(err) {
            console.log('put heart err',err);
        }
        res.json(result);
    });
});

router.get('/deleteheart/:userid/:productpk', (req, res, next) => {
    const user = req.params.userid;
    const product = req.params.productpk;
    const connection = mysql.createConnection(conn);
    connection.connect();

    const sql = `delete from shopping_mall.heart_table where user_id = ${user} and product_id =${product};`

    connection.query(sql, function(err,result, fields) {
        if(err) {
            console.log('delete heart err',err);
        }
        console.log('put heart result',result);
        res.json(result);
        connection.end();
    })
});

router.get('/:userid/heart',(req, res, next) => {
    const user = req.params.userid;
    const connection = mysql.createConnection(conn);
    connection.connect();
    
    const sql = `select product_id from shopping_mall.heart_table where user_id = '${user}';`
    connection.query(sql, function(err, result, fields) {
        if(err) {
            console.log('select data err modify',err);
        }
        console.log('-------select modify data 확인------', result);

        res.json(result);
        connection.end();
    })
})

router.get('/management/modify/:key',(req, res, next) => {
    // const key = req.data.key;
    // console.log('db key 확인',key);
    const key = req.params.key;
    console.log('key',key);
    const connection = mysql.createConnection(conn);
    connection.connect();

    const sql = `select * from shopping_mall.items where id = ${key};`;

    connection.query(sql, function(err, result, fields) {
        if(err) {
            console.log('select data err modify',err);
        }
        console.log('-------select modify data 확인------', result);

        res.json(result);
        connection.end();
    })
});

//데이터를 전달 받아서 넣어주는 것은 management에서 일어남
router.post('/management/store',upload.single('image'),(req, res, next) => {
    const name = req.body.name;
    const size = req.body.size;
    const type = req.body.type;
    const price = req.body.price;
    const id = req.body.id;
    const colors = req.body.colors;
    const image = req.file.filename; //이미지가 url로 오는게 아니라 사진 이름으로 옴

    console.log('id가 있는지 확인',id);
    const connection = mysql.createConnection(conn);
    let sql;
    connection.connect();
    if(id !== '') { //id가 있는 경우는 현재 있는 데이터를 수정함
        sql = `update shopping_mall.items SET name = '${name}', size = '${size}', type = '${type}', price = ${price}, colors = '${colors}', image = '${image}' where id = ${id};`;
    } else {  //id가 없는 경우는 데이터를 새롭게 생성해야 하는 것
        sql = `insert into shopping_mall.items (name, size, type, price, colors, image) values ('${name}', '${size}', '${type}', ${price}, '${colors}', '${image}');`;
    }

    connection.query(sql, function(err, results, fields) {
        if(err) {
            console.log('insert data err',err);
        }

        console.log('==========insert data==========',results);

        res.redirect('/management.html');
        connection.end();
    });
});

router.delete('/management/delete/:key',(req, res, next) => {
    const connection = mysql.createConnection(conn);
    connection.connect();
    const key = req.params.key;
    const sql = `delete FROM shopping_mall.items where id = ${key}`;

    connection.query(sql, function(err, result, fields) {
        if(err) {
            console.log('delete err',err);
        }
        res.json(result);
        connection.end();
    })
});

//test를 위한 dummy.file
router.post('/dummy',(req, res, next) => {
    const connection = mysql.createConnection(conn);
    connection.connect();
    const arr = req.body;
    const num = arr.length;

    let sql = `INSERT INTO shopping_mall.items (name, size, type, price) VALUES `

    for(let i = 0; i < num; i++) {
        if(i === num - 1) {
            sql += `('${arr[i].name}', ${arr[i].size}, '${arr[i].type}', ${arr[i].price});`;
        }else {
            sql += `('${arr[i].name}', ${arr[i].size}, '${arr[i].type}', ${arr[i].price}),`;
        }
    }
    connection.query(sql, function(err, results, fields) {
        if(err) {
            console.log('------dummy data err',err);
        }

        //console.log('들어간 결과 확인',results);
        res.status(201).json(results);
        connection.end();
    })
});

router.get('/:type',(req, res, next) => {  //현재 가지고 있는 데이터의 개수
    ///:type은 items가 가지고 있는 모든 url을 받음 
    //그래서 이렇게 포괄적인 함수는 맨 아래 있는게 좋음
    console.log('check');
    const connection = mysql.createConnection(conn);
    connection.connect();
    const type = req.params.type;
    let sql;
    if(type === 'all'){
        sql = `SELECT COUNT(*) AS itemsCount FROM shopping_mall.items;`;
        //sql = `SELECT COUNT(*) FROM shopping_mall.items`
    } else {
        sql = `SELECT COUNT(*) AS itemsCount FROM shopping_mall.items where type= '${type}';`;
    }

    connection.query(sql, function(err, results, fields) {
        if(err) {
            console.log('item database err',err);
        }

        console.log('data count',results);
        res.json(results);
        connection.end();
    });
});

module.exports = router;