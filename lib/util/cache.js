var fs = require('fs'),
    log = require('logging').from(__filename);


function save(file, data){
    var jsonFile = file + '.json.txt';
    log('writting json to ' + jsonFile);
    try {
        fs.writeFileSync(jsonFile, data);
    } catch (err) {
        log(err);
    }
}

function load(file, callback, notJSON) {
    var jsonFile = file + '.json.txt';

    log('reading from cache: ' + jsonFile);
    
    var json = fs.readFile(jsonFile, 'utf8', function(err, data){
        if (err) {
            log(err.message);
            callback(false);
        } else {
            callback(notJSON ? data :  JSON.parse(data));
        }
    });

}

module.exports.save = save;
module.exports.load = load;