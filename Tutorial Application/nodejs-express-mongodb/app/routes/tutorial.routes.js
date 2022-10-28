
module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");
  
    var router = require("express").Router();
  
    // Tạo một Tutorial mới
    router.post("/", tutorials.create);
  
    // Lấy tất cả Tutorial
    router.get("/", tutorials.findAll);
  
    // Lấy tất cả Tutorial Publish
    router.get("/published", tutorials.findAllPublished);
  
    // Lấy một Tutorial với id
    router.get("/:id", tutorials.findOne);
  
    // Cập nhật một Tutorial với id
    router.put("/:id", tutorials.update);
  
    // Xóa một Tutorial với id
    router.delete("/:id", tutorials.delete);
  
    // Xóa tất cả Tutorial
    router.delete("/", tutorials.deleteAll);
  
    app.use("/api/tutorials", router);
  };