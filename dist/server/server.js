"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restify = __importStar(require("restify"));
const environment_1 = require("../common/environment");
const mongoose_1 = __importDefault(require("mongoose"));
class Server {
    initializeDb() {
        mongoose_1.default.Promise = global.Promise;
        return mongoose_1.default.connect(environment_1.environment.db.url, {
            useMongoClient: true
        });
    }
    initRouts(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'the-livery-api',
                    version: '0.0.1'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                routers.forEach(router => {
                    router.applyRoutes(this.application);
                });
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRouts(routers).then(() => this));
    }
}
exports.Server = Server;
