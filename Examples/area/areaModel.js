/// <reference path="../dtos/area.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var eBmr;
(function (eBmr) {
    var models;
    (function (models) {
        var Area = (function (_super) {
            __extends(Area, _super);
            function Area() {
                _super.apply(this, arguments);
            }
            Area.prototype.newModel = function (areaDto) {
                this._areaDto = areaDto;
                this.stage(areaDto.stage);
            };
            Area.prototype.create = function (areaDto) {
                this.newModel(areaDto);
                this.setIsCreated(true);
            };
            Area.prototype.blank = function (areaDto) {
                this.newModel(areaDto);
                this.setIsBlank(true);
            };
            Area.prototype.markdelete = function () {
                this.setIsDeleted(true);
            };
            Area.prototype.name = function (name) {
                if (angular.isDefined(name)) {
                    this._areaDto.name = name;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.name;
            };
            Area.prototype.code = function (code) {
                if (angular.isDefined(code)) {
                    this._areaDto.code = code;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.code;
            };
            Area.prototype.unit = function (unit) {
                if (angular.isDefined(unit)) {
                    this._areaDto.unit = unit;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.unit;
            };
            Area.prototype.isDeleted = function (isDeleted) {
                if (angular.isDefined(isDeleted)) {
                    this._areaDto.isDeleted = isDeleted;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.isDeleted;
            };
            Area.prototype.isInactive = function (isInactive) {
                if (angular.isDefined(isInactive)) {
                    this._areaDto.isInactive = isInactive;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.isInactive;
            };
            Area.prototype.createdBy = function (createdBy) {
                if (angular.isDefined(createdBy)) {
                    this._areaDto.createdBy = createdBy;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.createdBy;
            };
            Area.prototype.createdDate = function (createdDate) {
                if (angular.isDefined(createdDate)) {
                    this._areaDto.createdDate = createdDate;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.createdDate;
            };
            Area.prototype.lastModifiedBy = function (lastModifiedBy) {
                if (angular.isDefined(lastModifiedBy)) {
                    this._areaDto.lastModifiedBy = lastModifiedBy;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.lastModifiedBy;
            };
            Area.prototype.lastModifiedDate = function (lastModifiedDate) {
                if (angular.isDefined(lastModifiedDate)) {
                    this._areaDto.lastModifiedDate = lastModifiedDate;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._areaDto.lastModifiedDate;
            };
            Area.prototype.stage = function (stage) {
                if (angular.isDefined(stage)) {
                    this._stageDto = stage;
                    this._areaDto.stage = (((stage || {})._links || {}).self || {}).href;
                    if (!this.getIsCreated())
                        this.setIsUpdated(true);
                }
                return this._stageDto;
            };
            Area.prototype.getAreaDto = function () {
                return this._areaDto;
            };
            return Area;
        })(models.TrackEntity);
        models.Area = Area;
    })(models = eBmr.models || (eBmr.models = {}));
})(eBmr || (eBmr = {}));
//# sourceMappingURL=areaModel.js.map