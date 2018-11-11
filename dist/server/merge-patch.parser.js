"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mpContentType = 'application/merge-patch+json';
exports.mergePatchBodyParser = (req, res, next) => {
    if (req.contentType() == mpContentType && req.method == 'PATCH')
        try {
            req.body = JSON.parse(req.body);
        }
        catch (e) {
            return next(`Error: invalide content: ${e.message}`);
        }
    return next();
};
