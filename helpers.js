const fs = require('fs');
const path = require('path');
const _ = require('lodash');


function getUserFilePath(username) {
    return path.join(__dirname, 'users', username) + '.json'
}

function getUser(username) {
    console.log(username)
    var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}))
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    _.keys(user.location).forEach(function (key) {
        user.location[key] = _.startCase(user.location[key])
    })
    return user
}

function saveUser(username, data) {
    var fp = getUserFilePath(username)
    fs.unlinkSync(fp) // delete the file
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'})
}

function verifyUser(req, res, next) {
    var fp = getUserFilePath(req.params.username)

    fs.exists(fp, function (yes) {
        if (yes) {
            next()
        } else {
            res.redirect('/error/' + req.params.username)
        }
    })
}

module.exports.getUser = getUser;
module.exports.getUserFilePath = getUserFilePath;
module.exports.saveUser = saveUser;
module.exports.verifyUser = verifyUser;