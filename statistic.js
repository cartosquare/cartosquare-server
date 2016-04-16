var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

function updateVisitCount(req, res, next) {
    var file = __dirname + "/" + "statistic.db";
    var exists = fs.existsSync(file);
    if (!exists) {
        console.log("Creating DB file.");
        fs.openSync(file, "w");
    }

    var db = new sqlite3.Database(file);
    db.serialize(function() {
        if (!exists) {
            console.log('create table ...');

            db.run("CREATE TABLE visit_count (visits INT)");
            db.run('INSERT INTO visit_count VALUES (?)', 0);
        }

        db.get("SELECT visits FROM visit_count", function(err, row) {
            if (err) {
                console.log('get visit count fail!');
                res.send({
                    key: -1
                });

                next();
            }

            var visits = row.visits;
            visits++;

            db.run("UPDATE visit_count SET visits = ?", visits);

            db.close();
            
            res.send({
                key: visits
            });

            next();
        });
    });
}

exports.updateVisitCount = updateVisitCount; 