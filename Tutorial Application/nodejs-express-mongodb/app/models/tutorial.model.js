// Xác định mongoose model

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean
    },
    { timestamps: true }
  );

  // Nếu sử dụng app này với giao diện FE người dùng cần trường id thay vì _id, phải ghi đè phương thức toJSON để map object mặc định thành custom object
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tutorial = mongoose.model("tutorial", schema);
  return Tutorial;
};
// Mongoose Model này đại diện cho Tutorial collection trong MongoDB database.
// Các trường này sẽ được tạo tự động cho mỗi tài liệu Tutorial: _id, title, description, published, createAt, updateAt, __v

  