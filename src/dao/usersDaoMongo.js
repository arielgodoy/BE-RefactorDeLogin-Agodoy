const { json } = require("express");
const { usersModel } = require("./models/users.model.js");

class UserDaoMongo {
  constructor() {
    this.model = usersModel;
  }

  async getUsers() {
    return await this.model.find({});
  }

  async getUser(filter) {
    console.log(filter);
    return await this.model.findOne(filter);
  }

  async findByEmail(email) {
    return this.model.findOne({ email }).lean(); // Adding .lean() to get a plain JavaScript object
  }
  

  async createUser(newUser) {
    return await this.model.create(newUser);
  }

  async updateUser(uid) {}
  async deleteUser(uid) {}
}

module.exports = UserDaoMongo;
