"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
        this.findByIdAndPopulate = (req, res, next) => {
            this.model.findById(req.params.id)
                .populate('user', 'name')
                .populate('restaurant')
                .then(this.render(res, next))
                .catch(next);
        };
    }
    prepareOne(query) {
        return query
            .populate('user', 'name')
            .populate('restaurant');
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = `$/restaurants/${restaurantId}`;
        const userId = document.user._id ? document.user._id : document.user;
        resource._links.user = `$/users/${userId}`;
        return resource;
    }
    applyRoutes(application) {
        application.get(this.basePath, this.findAll);
        application.get(this.baseIdPath, [this.validateId, this.findById]);
        application.post(this.basePath, this.save);
    }
}
exports.reviewsRouter = new ReviewsRouter();
