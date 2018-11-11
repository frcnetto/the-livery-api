import { Router } from '../common/router'
import * as restify from 'restify';
import { User } from './users.model';

class UsersRouter extends Router {

    usersNode = '/users';
    usersIdNode = this.usersNode + '/:id';

    constructor () {
        super();
        this.on( 'beforeRender', document => {
            document.password = undefined;
        } );
    }

    applyRoutes( application: restify.Server ) {
        application.get( this.usersNode, ( req, res, next ) => {
            User.find()
                .then( this.render( res, next ) );
        } );

        application.get( this.usersIdNode, ( req, res, next ) => {
            User.findById( req.params.id )
                .then( this.render( res, next ) );
        } );

        application.post( this.usersNode, ( req, res, next ) => {
            let user = new User( req.body );
            user.save()
                .then( this.render( res, next ) );
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
                .then( this.render( res, next ) );
        } );

        application.patch( this.usersIdNode, ( req, res, next ) => {
            const options = { new: true };
            User.findByIdAndUpdate( req.params.id, req.body, options )
                .then( this.render( res, next ) );
        } );

        application.del( this.usersIdNode, ( req, res, next ) => {
            User.deleteOne( { _id: req.params.id } ).exec().then( result => {
                console.log( result )
                if ( result.n )
                    res.send( 204 );
                else
                    res.send( 404 );
                return next();
            } );
        } );
    }
}

export const usersRouter = new UsersRouter();