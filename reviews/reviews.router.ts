import restify from 'restify';
import mongoose from 'mongoose'
import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";

class ReviewsRouter extends ModelRouter<Review> {

    constructor () {
        super( Review );
    }

    protected prepareOne( query: mongoose.DocumentQuery<Review, Review> ): mongoose.DocumentQuery<Review, Review> {
        return query
            .populate( 'user', 'name' )
            .populate( 'restaurant' );
    }

    envelope( document: any ): any {
        let resource = super.envelope( document );

        const restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = `$/restaurants/${restaurantId}`;

        const userId = document.user._id ? document.user._id : document.user;
        resource._links.user = `$/users/${userId}`;

        return resource;
    }

    findByIdAndPopulate = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        this.model.findById( req.params.id )
            .populate( 'user', 'name' )
            .populate( 'restaurant' )
            .then( this.render( res, next ) )
            .catch( next );
    }

    applyRoutes( application: restify.Server ) {
        application.get( this.basePath, this.findAll );

        application.get( this.baseIdPath, [ this.validateId, this.findById ] );

        application.post( this.basePath, this.save );

    }
}

export const reviewsRouter = new ReviewsRouter();