"use strict";
exports.__esModule = true;
// const RimaService = require('../services/rimaService').RimaService;
var rimaService_1 = require("../services/rimaService");
var MAP_ID = "5af39ce82843ddf04b459cb0";
//export public class CoLaboArthonService {
var CoLaboArthonService = /** @class */ (function () {
    function CoLaboArthonService() {
        this.rimaService = new rimaService_1.RimaService(MAP_ID);
    }
    CoLaboArthonService.prototype.saveParticipant = function (name, background) {
        var result = this.rimaService.createNewUser(name + ":" + background);
        return "CoLaboArthonService:" + result;
    };
    return CoLaboArthonService;
}());
exports.CoLaboArthonService = CoLaboArthonService;
