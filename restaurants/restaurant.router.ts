import restify from 'restify';

import { Restaurant } from './restaurant.model';
import { ModelRouter } from '../common/model-router';
import { NotFoundError } from 'restify-errors';

class RestaurantsRouter extends ModelRouter<Restaurant> {

    restaurantsNode = '/restaurants';
    restaurantsIdNode = this.restaurantsNode + '/:id';
    restaurantsIdMenuNode = this.restaurantsIdNode + '/menu';

    constructor () {
        super( Restaurant );
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

        application.get( this.restaurantsNode, this.findAll );

        application.get( this.restaurantsIdNode, [ this.validateId, this.findById ] );

        application.post( this.restaurantsNode, this.save );

        application.put( this.restaurantsIdNode, [ this.validateId, this.replace ] );

        application.patch( this.restaurantsIdNode, [ this.validateId, this.update ] );

        application.del( this.restaurantsIdNode, [ this.validateId, this.delete ] );

        application.get( this.restaurantsIdMenuNode, [ this.validateId, this.findMenu ] );

        application.put( this.restaurantsIdMenuNode, [ this.validateId, this.replaceMenu ] );
    }
}

export const restaurantsRouter = new RestaurantsRouter();