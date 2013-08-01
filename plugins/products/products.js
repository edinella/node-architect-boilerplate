
// exports setup
module.exports = function setup(options, imports, register) {
  
  var fakeDB = [
    {"id":1, "name": "Product 1"},
    {"id":2, "name": "Product 2"},
    {"id":3, "name": "Product 3"}
  ];
  
  register(null, {"products": {
    "index": function(req, res) {
      return res.send(200, fakeDB);
    },
    "create": function(req, res) {
      req.body.id = req.body.length+1;
      fakeDB.push(req.body);
      return res.send(201, req.body);
    },
    "show": function(req, res) {
      for(var i in fakeDB)
        if(fakeDB[i].id == req.params.id)
          return res.send(200, fakeDB[i]);
      return res.send(404);
    },
    "update": function(req, res) {
      for(var i in fakeDB)
        if(fakeDB[i].id == req.params.id) {
          fakeDB[i] = req.body;
          return res.send(200, fakeDB[i]);
        }
      return res.send(404);
    },
    "destroy": function(req, res) {
      for(var i in fakeDB)
        if(fakeDB[i].id == req.params.id)
          fakeDB.splice(i, 1);
      return res.send(204);
    }
  }});
};