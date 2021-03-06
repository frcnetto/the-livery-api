"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restaurant_model_1 = require("./restaurant.model");
const model_router_1 = require("../common/model-router");
const restify_errors_1 = require("restify-errors");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurant_model_1.Restaurant);
        this.restaurantsIdMenuNode = this.baseIdPath + '/menu';
        this.findMenu = (req, res, next) => {
            restaurant_model_1.Restaurant.findById(req.params.id, '+menu')
                .then(restaurant => {
                if (!restaurant)
                    return next(new restify_errors_1.NotFoundError('Restaurant not found'));
                res.json(restaurant.menu);
                return next();
            }).catch(next);
        };
        this.replaceMenu = (req, res, next) => {
            restaurant_model_1.Restaurant.findById(req.params.id)
                .then(restaurant => {
                if (!restaurant)
                    return next(new restify_errors_1.NotFoundError('Restaurant not found'));
                restaurant.menu = req.body;
                return restaurant.save();
            })
                .then(restaurant => {
                res.json(restaurant.menu);
                return next();
            })
                .catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    applyRoutes(application) {
        application.get(this.basePath, this.findAll);
        application.get(this.baseIdPath, [this.validateId, this.findById]);
        application.post(this.basePath, this.save);
        application.put(this.baseIdPath, [this.validateId, this.replace]);
        application.patch(this.baseIdPath, [this.validateId, this.update]);
        application.del(this.baseIdPath, [this.validateId, this.delete]);
        application.get(this.restaurantsIdMenuNode, [this.validateId, this.findMenu]);
        application.put(this.restaurantsIdMenuNode, [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
