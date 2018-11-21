import { Server } from './server/server';
import { usersRouter } from './users/users.router';
import { restaurantsRouter } from './restaurants/restaurant.router';
import { reviewsRouter } from './reviews/reviews.router';

const server = new Server();

server.bootstrap( [ usersRouter, restaurantsRouter, reviewsRouter ] ).then( server => {
    console.log( 'Listening on:', server.application.address() );
} ).catch( error => {
    console.log( 'Server failed to start!' );
    console.error( error );
    process.exit( 1 );
} );
