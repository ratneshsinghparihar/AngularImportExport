/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/linq/linq.d.ts" />
/// <reference path="../../../../typings/sprintf/sprintf.d.ts" />

/// <reference path="../../../models/main.ts" />
 
module eBmr.dtos {

    export class Area{

        name: String;
        code;
        unit;
        isDeleted;
        isInactive;
        createdBy;
        createdDate;
        lastModifiedBy;
        lastModifiedDate;
        stage;

       

        constructor(params: any) {
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
}}