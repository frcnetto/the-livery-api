"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
        this.reviewsNode = '/Reviews';
        this.reviewsIdNode = this.reviewsNode + '/:id';
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
    applyRoutes(application) {
        application.get(this.reviewsNode, this.findAll);
        application.get(this.reviewsIdNode, [this.validateId, this.findById]);
        application.post(this.reviewsNode, this.save);
    }
}
exports.reviewsRouter = new ReviewsRouter();
