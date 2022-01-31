const express = require('express');
const mysql = require('mysql');

const conn = {
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '1234',
    database : 'shopping_mall',
}

function putheart(data, userid, cb) {
    const connection = mysql.createConnection(conn);
    connection.connect();
    const result = [];
    for(let i = 0 ; i < data.length; i++) {
        const temp = [];
        temp.push(`${userid}`);
        temp.push(data[i]);
        result.push(temp);
    }
    console.log('putheart해줄 result확인하기',result)

    const sql = `insert into shopping_mall.heart_table(user_id, product_id) values ?;`

    connection.query(sql, [result], cb);
    connection.end();
}

module.exports = putheart