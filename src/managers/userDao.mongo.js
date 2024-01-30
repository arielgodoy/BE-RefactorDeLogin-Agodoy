const { usersModel } = require("../models/users.model.js")
class UserDaoMongo { // manager User
    constructor() {
        //  iniciar la base de datos
        this.userModel = usersModel
    }
}
    
module.exports = UserDaoMongo
    