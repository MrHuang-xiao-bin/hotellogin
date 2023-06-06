var express = require('express');
var app = express();
var multer = require('multer');
var bodyparse = require('body-parser');
const bodyParser = require('body-parser');
var mysql = require('mysql');
const {
	json
} = require('express/lib/response');
app.use(bodyParser.urlencoded({
	extended: true
}))
app.all('/up_info', (req, res) => {
	var info =JSON.parse(JSON.stringify(req.body)) ;
	console.log(info.phone)
	var pool = mysql.createConnection({
		host: '127.0.0.1',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'hotel',
		dateStrings:true

	});
	pool.connect();
	var d=new Date();
	//d.setHours(d.getHours()+8);
	 // svar sign_date=d.toJSON().substr()
	// console.log(sign_date)
	var operatesql ='insert into sign_info(id,visitor,idcard,phone,room,roomtype,signtime,others) values(null,?,?,?,?,?,?,?)'
	var params = [info.visitor, info.idcard, info.phone, info.room, info.roomtype,d, info.others]
	pool.query(operatesql, params, (err, result) => {
		if (err) {
			console.log("error:", err.message);
		}
		//console.log(result);
		res.send("成功上传")
	});
	pool.end();
});


app.all('/getall', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin','*')
	var pool = mysql.createConnection({
		host: '127.0.0.1',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'hotel',
		dateStrings:true

	});
	pool.connect();
	var operatesql ='select * from sign_info'
	pool.query(operatesql,(err, result) => {
		if (err) {
			console.log("error:", err.message);
		}
		//console.log(result);
		res.send(result)
	});
	pool.end();
});

app.all('/findbyidname', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin','*')
	var msgs=req.query;
	//console.log(msgs)
	var pool = mysql.createConnection({
		host: '127.0.0.1',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'hotel',
		dateStrings:true

	});
	pool.connect();
	var operatesql ='select * from sign_info where visitor=? and idcard=?'
	var params=[msgs.findname,msgs.findidcard]
	pool.query(operatesql, params,(err, result) => {
		if (err) {
			console.log("error:", err.message);
		}
		//console.log(result);
		res.send(result)
	});
	pool.end();
});


app.all('/fliterdate', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin','*')
	var msgs=req.query;
	//console.log(msgs)
	var pool = mysql.createConnection({
		host: '127.0.0.1',
		user: 'root',
		password: 'root',
		port: '3306',
		database: 'hotel',
		dateStrings:true

	});
	pool.connect();
	//var operatesql ='select id from sign_info where signtime like "2023-06-04%"'
	var operatesql ='select * from sign_info where id>= (select id from sign_info where signtime like ?"%" limit 0,1)'
	var params=[msgs.datevalue]
	pool.query(operatesql, params,(err, result) => {
		if (err) {
			console.log("error:", err.message);
		}
		//console.log(result);
		res.send(result)
	});
	pool.end();
});
app.listen(8001, () => {

	console.log("node服务器服务端口8001成功开启")
})