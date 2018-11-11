import * as restify from 'restify';
import { environment } from '../common/environment';
import { Router } from '../common/router';
import mongoose from 'mongoose';

export class Server {

    application!: restify.Server;

    initializeDb(): Promise<any> {
        ( <any>mongoose ).Promise = global.Promise;

        return mongoose.connect( environment.db.url, {
            useNewUrlParser: true
        } );
    }

    initRouts( routers: Router[] ): Promise<any> {
        return new Promise( ( resolve, reject ) => {
            try {

                this.application = restify.createServer( {
                    name: 'the-livery-api',
                    version: '0.0.1'
                } );

                this.application.use( restify.plugins.queryParser() );
                this.application.use( restify.plugins.bodyParser() );

                routers.forEach( router => {
                    router.applyRoutes( this.application );
                } );

                this.application.listen( environment.server.port, () => {
                    resolve( this.application );
                } )

            } catch ( error ) {
                reject( error );
            }
        } );
    }

    bootstrap( routers: Router[] = [] ): Promise<Server> {
        return this.initializeDb().then(
            () => this.initRouts( routers ).then( () => this )
        );
    }
}