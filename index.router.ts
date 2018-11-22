import { Router } from './common/router'
import * as restify from 'restify'

class IndexRouter extends Router {
    applyRoutes( application: restify.Server ) {
        application.get( '/', ( req, resp, next ) => {
            resp.json( {
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews'
            } )
        } )
    }
}

export const indexRouter = new IndexRouter()
