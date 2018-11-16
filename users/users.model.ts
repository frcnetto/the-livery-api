import mongoose from 'mongoose';
import { validateCPF } from '../common/validators';

const Schema = mongoose.Schema;

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    age: number,
    birth: Date,
    active: boolean
}

const userSchema = new Schema( {
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
        enum: [ 'M', 'F' ]
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    },
    active: {
        type: Boolean,
        default: 'no'
    }
} );

export const User = mongoose.model<User>( 'User', userSchema );