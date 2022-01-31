const express = require('express');
const mysql = require('mysql');
const putheart = require('../util/temp');

const conn = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'shopping_mall'
}

const router = express.Router();

router.get('/getuserid', (req, res, next) => {
    //session을 통해서 userid를 보내줌(로그인이 되어있으면 아이디를 보내줌)
    const id = req.session.userId;
    res.json(id);
});

router.get('/getuserpk', (req, res, next) => {
    //session을 통해서 user의 pk를 보내줌
    const pk = req.session.userpk;
    res.json(pk);
})

router.post('/login',(req, res, next) => {
    const connection = mysql.createConnection(conn);
    connection.connect();
    const information = req.body;
    console.log('information data',information.arr);
    const arr = information.arr !== '' ? JSON.parse(information.arr) : null;
    console.log('information data',information);

    const sql = `select * from shopping_mall.login where name = '${information.id}' and password = '${information.password}';`;

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('find information err', err);
        }

        console.log('-----select information------');
        if (result) {
            req.session.userId = information.id;
            req.session.userpk = result[0].id;
            req.session.save(err => {
                if(err) {
                    console.log('session err',err);
                }
                if(arr !== null) {
                    putheart(arr, req.session.userId, function(err, result, fields) {
                        if(err) {
                            console.log('put heart err',err);
                        }
                    });
                }
            })
            res.redirect('/');
        } else {
            res.redirect('/login.html')  //여기서 redirect를 해서 이미 res 해줬기 때문에 아래서 res해서 다른 data를 보내지는 못함 data와 함께 redirct를 하는 방법은 session을 사용하는 방법
        }

        connection.end();
    })
});

router.get('/logout', (req, res, next) => {
    const connection = mysql.createConnection(conn);
    connection.connect();
    console.log('logout');

    req.session.destroy(function() {
        req.session;
    });

    res.redirect('/');
})


router.post('/signup', (req, res, next) => {
    const connection = mysql.createConnection(conn);
    connection.connect();
    const information = req.body;

    console.log(information.name, information.password);
    const sql = `INSERT INTO shopping_mall.login (name, password) VALUES ('${information.name}', '${information.password}');`

    connection.query(sql, function(err, result, fields) {
        if(err) {
            console.log('signup err',err);
            res.json(err);
        }
        res.redirect('/login');
        connection.end()
    })
});

module.exports = router;
