import restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

export abstract class Router extends EventEmitter {
    abstract applyRoutes( application: restify.Server ): any;

    render( res: restify.Response, next: restify.Next ) {
        return ( document: any ) => {
            if ( document ) {
                this.emit( 'beforeRender', document );
                res.json( document );
            } else {
                throw new NotFoundError( 'Documento não encontrado.' );
            }
            return next();
        }
    }

    renderAll( res: restify.Response, next: restify.Next ) {
        return ( documents: any[] ) => {
            if ( documents )
                documents.forEach( document => {
                    this.emit( 'beforeRender', document );
                    res.json( document );
                } )
            else
                res.json( [] );
            return next();
        }
    }
}