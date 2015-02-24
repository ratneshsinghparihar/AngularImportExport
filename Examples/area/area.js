/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/linq/linq.d.ts" />
/// <reference path="../../../../typings/sprintf/sprintf.d.ts" />
/// <reference path="../../../models/main.ts" />
var eBmr;
(function (eBmr) {
    var dtos;
    (function (dtos) {
        var Area = (function () {
            function Area(params) {
                params = params || {};
                this.name = params.name;
                this.code = params.code;
                this.unit = params.unit;
                this.isDeleted = params.isDeleted;
                this.isInactive = params.isInactive;
                this.createdBy = params.createdBy;
                this.createdDate = params.createdDate;
                this.lastModifiedBy = params.lastModifiedBy;
                this.lastModifiedDate = params.lastModifiedDate;
                this.stage = params.stage;
            }
            return Area;
        })();
        dtos.Area = Area;
    })(dtos = eBmr.dtos || (eBmr.dtos = {}));
})(eBmr || (eBmr = {}));
//# sourceMappingURL=area.js.map