const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');

const accountSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

accountSchema.statics.registerAccount = async function(email, password) {
    email = email.toLowerCase();
    let account = new Account({email: email, password: bcrypt.hashSync(password, 10)});
    if (!await this.findOne({email: email})) {
        await account.save();
        return account;
    } else {
        throw new Error("This email is already taken");
    }
};

accountSchema.statics.loginAccount = async function(email, password){
    email = email.toLowerCase();
    let user = await this.findOne({email: email});
    if(!user){
        throw new Error("This account does not exist");
    }
    if (!bcrypt.compareSync(password, user.password)){
        throw new Error("The username or password is invalid");
    }
    return user;
};

const Account = mongoose.model("Account", accountSchema);

module.exports = accountSchema;