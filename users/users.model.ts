import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { validateCPF } from '../common/validators';
import { environment } from '../common/environment';

const Schema = mongoose.Schema;

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    age: number,
    birth: Date,
    active: boolean
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail( email: string ): Promise<User>;
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

userSchema.statics.findByEmail = function ( email: string ) {
    return this.findOne( { email } );
}

const saveMiddleware = function ( next: any ) {

    const user: User = this;

    if ( !user.isModified( 'password' ) )
        next();
    else
        hashPassword( user, next );
}

const updateMiddeware = function ( next: any ) {

    if ( !this.getUpdate().password )
        next();
    else
        hashPassword( this.getUpdate, next );
}

const hashPassword = ( obj: any, next: any ) => {
    bcrypt.hash( obj.password, environment.security.saltRound, function ( err, hash ) {
        if ( !err )
            obj.password = hash;
        next();
    } );
}

userSchema.pre( 'save', saveMiddleware );
userSchema.pre( 'findOneAndUpdate', updateMiddeware );
userSchema.pre( 'update', updateMiddeware );

export const User = mongoose.model<User, UserModel>( 'User', userSchema );