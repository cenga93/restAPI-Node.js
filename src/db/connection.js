const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(`${process.env.HOST_NAME}/${process.env.DB_NAME}`, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.log("DB Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connection;
