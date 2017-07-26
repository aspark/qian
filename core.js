const Nightmare = require('nightmare')

const fs = require('fs')
const path = require('path')
const Q = require('q')
const utils = require('./utils')
const mail = require('./mail')
const config = require('./config')

const url = "https://qian.qq.com"

function run() {
    let nightmare = Nightmare();
    nightmare.goto(url)
        .wait('.item-box')
        .evaluate(function (selector, done) {
            return $('.item-box').map(function (i, e) {
                var target = $(e);
                return {
                    name: target.find('.name').text(),
                    percent: +(target.find('.profit .num').text().replace('%', '')) / 100,
                    range: target.find('.profit')[0].childNodes[0].nodeValue,
                    tips: target.find('.tips').text(),
                    prompt: target.find('.profit').text()
                };
            }).toArray();
        })//, '.item-box'
        .end()
        .then(analysis);
}

function analysis(result) {
    var current = {
        time: (new Date()).toISOString(),
        items: result
    }

    // console.log(result)

    var dir = path.join(__dirname, 'log');
    if (fs.existsSync(dir) == false) {
        fs.mkdirSync(dir);
    }

    var historyFileName = path.join(dir, 'history.log');
    var lastFileName = path.join(dir, 'last.tmp');

    getLast(lastFileName).then(function (last) {
        fs.writeFileSync(lastFileName, JSON.stringify(current))

        var addedItems = null;
        var deletedItems = null;
        var fnKey = function (o) { return o.name };
        if (last != null) {
            var lastDic = utils.convert2Dic(last.items, fnKey);
            var currentDic = utils.convert2Dic(current.items, fnKey);

            addedItems = utils.minusDic(currentDic, lastDic);
            deletedItems = utils.minusDic(lastDic, currentDic);
        }

        fnPrompt = function (o) { return `${o.name}(${o.prompt})` };
        if ((addedItems && addedItems.length) || (deletedItems && deletedItems.length)) {
            fs.appendFileSync(historyFileName, JSON.stringify(current) + '\r\n')//record changed
            var msg = 'deleted: '+ deletedItems.map(fnPrompt).join(', ') +'\r\n';//fnKey
            msg += 'added: '+ addedItems.map(fnPrompt).join(', ');
            notify(msg);
        }
        else {
            notify('no changed');
        }
    })
}

function notify(msg){
    console.log(msg);

    mail.send(config.changedReceivers, 'qian monitor result', msg);

}


function getLast(filename) {
    var deferred = Q.defer();
    if (fs.existsSync(filename)) {
        fs.readFile(filename, 'utf-8', function (err, d) {
            deferred.resolve(JSON.parse(d));
        })
    }
    else {
        deferred.resolve(null);
    }

    return deferred.promise;
}

exports.run = run;