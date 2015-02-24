/// <reference path="../dtos/area.ts" />
 
module eBmr.models {
    export class Area extends TrackEntity {


        private _areaDto: eBmr.dtos.Area;
        private _stageDto: any;

        public newModel(areaDto) {
            this._areaDto = areaDto;
            this.stage(areaDto.stage);
        }

        create(areaDto: eBmr.dtos.Area) {
            this.newModel(areaDto);
            this.setIsCreated(true);
            
        }

        blank(areaDto) {
            this.newModel(areaDto);
            this.setIsBlank(true);
        }

        markdelete() {
            this.setIsDeleted(true);
        }

        name(name) {
            if (angular.isDefined(name)) {
                this._areaDto.name = name;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.name;
        }


        code(code) {
            if (angular.isDefined(code)) {
                this._areaDto.code = code;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.code;
        }

        unit(unit) {
            if (angular.isDefined(unit)) {
                this._areaDto.unit = unit;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.unit;
        }

        isDeleted(isDeleted) {
            if (angular.isDefined(isDeleted)) {
                this._areaDto.isDeleted = isDeleted;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.isDeleted;
        }

        isInactive(isInactive) {
            if (angular.isDefined(isInactive)) {
                this._areaDto.isInactive = isInactive;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.isInactive;
        }

        createdBy(createdBy) {
            if (angular.isDefined(createdBy)) {
                this._areaDto.createdBy = createdBy;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.createdBy;
        }

        createdDate(createdDate) {
            if (angular.isDefined(createdDate)) {
                this._areaDto.createdDate = createdDate;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.createdDate;
        }

        lastModifiedBy(lastModifiedBy) {
            if (angular.isDefined(lastModifiedBy)) {
                this._areaDto.lastModifiedBy = lastModifiedBy;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.lastModifiedBy;
        }

        lastModifiedDate(lastModifiedDate) {
            if (angular.isDefined(lastModifiedDate)) {
                this._areaDto.lastModifiedDate = lastModifiedDate;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._areaDto.lastModifiedDate;
        }

        stage(stage?: any) {
            if (angular.isDefined(stage)) {
                this._stageDto = stage;
                this._areaDto.stage = (((stage || {})._links || {}).self || {}).href;
                if (!this.getIsCreated()) this.setIsUpdated(true);
            }
            return this._stageDto;
        }



        getAreaDto() {

            return this._areaDto;


        }
    }
}