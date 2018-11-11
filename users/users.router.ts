import { Router } from '../common/router'
import * as restify from 'restify';
import { User } from './users.model';

class UsersRouter extends Router {

    usersNode = '/users';
    usersIdNode = this.usersNode + '/:id';

    applyRoutes( application: restify.Server ) {
        application.get( this.usersNode, ( req, res, next ) => {
            User.find().then( users => {
                res.json( users );
                return next;
            } );
        } );

        application.get( this.usersIdNode, ( req, res, next ) => {
            User.findById( req.params.id ).then( user => {
                if ( user ) {
                    res.json( user );
                    return next();
                }
                res.send( 404 );
                return next();
            } );
        } );

        application.post( this.usersNode, ( req, res, next ) => {
            let user = new User( req.body );
            user.save().then( user => {
                user.password = '*';
                res.json( user );
                return next();
            } );
        } );

        application.put( this.usersIdNode, ( req, res, next ) => {
            const options = { overwrite: true }
            User.update( { _id: req.params.id }, req.body, options )
                .exec()
                .then( result => {
                    if ( result.n ) {
                        return User.findById( req.params.id );
                    } else {
                        res.send( 404 );
                    }
                } )
                .then( user => {
                    res.json( user );
                    return next();
                } );
        } );

        application.patch( this.usersIdNode, ( req, res, next ) => {
            const options = { new: true };
            User.findByIdAndUpdate( req.params.id, req.body, options )
                .then( user => {
                    if ( user )
                        res.json( user );
                    else
                        res.send( 404 );
                    return next();
                } );
        } );
    }
}

export const usersRouter = new UsersRouter();