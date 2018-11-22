"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validators_1 = require("../common/validators");
const environment_1 = require("../common/environment");
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    age: {
        type: Number,
        min: 0
    },
    birth: {
        type: Date,
        max: new Date()
    },
    gender: {
        type: String,
        required: false,
        enum: ['M', 'F']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validators_1.validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    },
    active: {
        type: Boolean,
        default: 'no'
    }
});
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};
const saveMiddleware = function (next) {
    const user = this;
    if (!user.isModified('password'))
        next();
    else
        hashPassword(user, next);
};
const updateMiddeware = function (next) {
    if (!this.getUpdate().password)
        next();
    else
        hashPassword(this.getUpdate, next);
};
const hashPassword = (obj, next) => {
    bcrypt_1.default.hash(obj.password, environment_1.environment.security.saltRound, function (err, hash) {
        if (!err)
            obj.password = hash;
        next();
    });
};
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddeware);
userSchema.pre('update', updateMiddeware);
exports.User = mongoose_1.default.model('User', userSchema);
