/**
 * 服务
 */

var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

var app = express();

//数据库操作实例
var db = mongojs('127.0.0.1:27017/contactList', ['contactList']);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// 设置路由
// 获取通讯录列表
app.get('/contactList', function (req, res) {
    //从数据库中获取联系人信息
    db.contactList.find(function (err, docs) {
        if (err) {
            console.error(err);
            return;
        }
        res.json(docs);
    });
});

//删除通讯录的路由
app.get('/deletList', function (req, res) {
    console.log('执行通讯的删除操作!');
    //数据删除
    deleteByContactId(req.query.id, function (doc) {
        res.json(doc);
    });
});

//获取单个联系人的路由
app.get('/getContect', function (req, res) {
    var id = req.query.id;
    //获取联系人
    db.contactList.find({ _id: mongojs.ObjectId(id) }, function (err, docs) {
        if (err) {
            console.error(err);
            return;
        }
        res.json(docs);
    });

});

// 添加保存通讯录的路由
app.post('/saveContact', function (req, res) {
    var body = req.body;
    //数据插入
    insertToDB(body, function (doc) {
        console.log(doc);
        res.json(doc);
    });
});

app.post('/updateContect', function (req, res) {
    var body = req.body;
    console.log('接收到更新请求，待更新数据为：');
    console.log(body);
    //执行更新操作
    updateContect(body, function (doc) {
        res.json(doc);
    });

});



app.listen(3000);

/**
 * 将数据写入数据库
 * @param  obj  待写入数据的实体
 * @param  callback 数据写入成功后的回调函数
 */
function insertToDB(obj, callback) {
    db.contactList.insert(obj, function (err, doc) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('数据插入成功！');
        if (callback) {
            callback(doc);
        }
    });
}

/**
 * 删除通讯录中的记录
 * @param id 通讯录编号
 * @param callback 回调
 */
function deleteByContactId(id, callback) {
    db.contactList.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('数据删除成功！');
        if (callback) {
            callback(doc);
        }
    });
}

/**
 * 更新联系人
 * @param  contact 联系人对象
 * @param  callback 回调函数
 */
function updateContect(contact, callback) {
    db.contactList.findAndModify({
        query: { _id: mongojs.ObjectId(contact._id) },
        update: { $set: { name: contact.name, email: contact.email, number: contact.number } },
        new: false
    }, function (err, doc, lastErrorObject) {
        if (err) {
            console.error(err);
            return;
        }
        if (callback) {
            callback(doc);
        }
    })
}

console.log('服务启动！');
