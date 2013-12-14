
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Ramses' });
};

exports.racklist = function(db) {
    return function(req, res) {
        var collection = db.get('rackData');
        collection.find({},{},function(e,docs){
            res.render('racklist', {
                "racklist" : docs
            });
        });
    };
};
