import restify from 'restify';

import { Restaurant } from './restaurant.model';
import { ModelRouter } from '../common/model-router';
import { NotFoundError } from 'restify-errors';

class RestaurantsRouter extends ModelRouter<Restaurant> {

    restaurantsIdMenuNode = this.baseIdPath + '/menu';

    constructor () {
        super( Restaurant );
    }

    envelope( document: any ): any {
        let resource = super.envelope( document );
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }

    findMenu = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        Restaurant.findById( req.params.id, '+menu' )
            .then( restaurant => {

                if ( !restaurant )
                    return next( new NotFoundError( 'Restaurant not found' ) );

                res.json( restaurant.menu );
                return next();

            } ).catch( next );
    }

    replaceMenu = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        Restaurant.findById( req.params.id )
            .then( restaurant => {

                if ( !restaurant )
                    return next( new NotFoundError( 'Restaurant not found' ) );

                restaurant.menu = req.body;
                return restaurant.save();

            } )
            .then( restaurant => {
                res.json( restaurant.menu );
                return next();
            } )
            .catch( next );
    }

    applyRoutes( application: restify.Server ) {

        application.get( this.basePath, this.findAll );

        application.get( this.baseIdPath, [ this.validateId, this.findById ] );

        application.post( this.basePath, this.save );

        application.put( this.baseIdPath, [ this.validateId, this.replace ] );

        application.patch( this.baseIdPath, [ this.validateId, this.update ] );

        application.del( this.baseIdPath, [ this.validateId, this.delete ] );

        application.get( this.restaurantsIdMenuNode, [ this.validateId, this.findMenu ] );

        application.put( this.restaurantsIdMenuNode, [ this.validateId, this.replaceMenu ] );
    }
}

export const restaurantsRouter = new RestaurantsRouter();