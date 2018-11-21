import restify from 'restify';
import mongoose from 'mongoose'
import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";

class ReviewsRouter extends ModelRouter<Review> {

    reviewsNode = '/Reviews';
    reviewsIdNode = this.reviewsNode + '/:id';

    constructor () {
        super( Review );
    }

    protected prepareOne( query: mongoose.DocumentQuery<Review, Review> ): mongoose.DocumentQuery<Review, Review> {
        return query
            .populate( 'user', 'name' )
            .populate( 'restaurant' );
    }

    findByIdAndPopulate = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        this.model.findById( req.params.id )
            .populate( 'user', 'name' )
            .populate( 'restaurant' )
            .then( this.render( res, next ) )
            .catch( next );
    }

    applyRoutes( application: restify.Server ) {
        application.get( this.reviewsNode, this.findAll );

        application.get( this.reviewsIdNode, [ this.validateId, this.findById ] );

        application.post( this.reviewsNode, this.save );

    }
}

export const reviewsRouter = new ReviewsRouter();