import { Router } from "./router";
import mongoose from "mongoose";
import restify from "restify";
import { NotFoundError } from "restify-errors";


export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    basePath: string;
    baseIdPath: string;

    constructor ( protected model: mongoose.Model<D> ) {
        super();
        this.basePath = `/${this.model.collection.name}`;
        this.baseIdPath = `/${this.model.collection.name}/:id`;
    }

    protected prepareOne( query: mongoose.DocumentQuery<D, D> ): mongoose.DocumentQuery<D, D> {
        return query;
    }

    envelope( document: any ): any {
        console.log( document )
        let resource = Object.assign( { _links: {} }, document.toJSON() );
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }

    validateId = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        if ( !mongoose.Types.ObjectId.isValid( req.params.id ) )
            next( new NotFoundError( 'Documento não encontrado' ) );
        else
            next();
    }

    findAll = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        this.model.find()
            .then( this.renderAll( res, next ) )
            .catch( next );
    }

    findById = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        this.prepareOne( this.model.findById( req.params.id ) )
            .then( this.render( res, next ) )
            .catch( next );
    }

    save = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        let user = new this.model( req.body );
        user.save()
            .then( this.render( res, next ) )
            .catch( next );
    }

    replace = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        const options = { runValidators: true, overwrite: true }
        this.model.update( { _id: req.params.id }, req.body, options )
            .exec()
            .then( result => {
                if ( result.n ) {
                    return this.model.findById( req.params.id );
                } else {
                    throw new NotFoundError( 'Documento não encontrado.' );
                }
            } )
            .then( this.render( res, next ) )
            .catch( next );
    }

    update = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        const options = { runValidators: true, new: true };
        this.model.findByIdAndUpdate( req.params.id, req.body, options )
            .then( this.render( res, next ) )
            .catch( next );
    }

    delete = ( req: restify.Request, res: restify.Response, next: restify.Next ) => {
        this.model.deleteOne( { _id: req.params.id } ).exec().then( result => {
            console.log( result )
            if ( result.n )
                res.send( 204 );
            else
                throw new NotFoundError( 'Documento não encontrado.' );
            return next();
        } );
    }

}