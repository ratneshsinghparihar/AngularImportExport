/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/linq/linq.d.ts" />
/// <reference path="../../../typings/sprintf/sprintf.d.ts" />

/// <reference path="../../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../typings/angularjs/angular-ui-router.d.ts" />
/// <reference path="../../models/buildingBlocks/models/inventoryModel.ts" />
/// <reference path="../../models/buildingBlocks/models/areaModel.ts" />
/// <reference path="../services/inventoryService.ts" />
/// <reference path="../../common/js/services/commonServices.ts" />
/// <reference path="../../models/main.ts" />


//import sprintf = require('sprintf'); 

module eBmr.controllers {

    export interface IAreaController {
        headerText: string;
        searchObj: any;
        stages: any;
        areas: Array<eBmr.models.Area>;
        unitTypes: Array<string>;  
        isEdit: boolean;
        isSaveDisabled: boolean;
        isMasterDataFetched: boolean;
        isMasterDataFetchInProgress: boolean;
        backupArea: eBmr.models.Area;
        selectedArea: eBmr.models.Area;
        modelOptions: any;
        exportParam: boolean;
        importParam: boolean;

        fetchAreas(): void;
        editArea(index): void;
        createArea(): void;
        save(): void;
        cancel(): void;       
        showAreaList(): void;
        exportCsv(): void;
        importCsv(files: any): void;
        saveImported(): void;
        deleteArea(areaModel: eBmr.models.Area): void;
    }

    export interface IAreaScope extends ng.IScope {
        vm: IAreaController;
    }


    class areaController implements IAreaController{

        'use strict'

        headerText: string;
        searchObj: any;
        stages: any;
        areas: Array<eBmr.models.Area>;
        unitTypes: Array<string>;
        isEdit: boolean;
        isSaveDisabled: boolean;
        isMasterDataFetched: boolean;
        isMasterDataFetchInProgress: boolean;
        backupArea: eBmr.models.Area;
        selectedArea: eBmr.models.Area;
        modelOptions: any;
        exportParam: boolean;
        importParam: boolean;


        private controllerName = 'areaController';
        private httpGetParams = [];
        private rootUrl = eBmrApp.resources.urls.getAllLocations;
        private headerTextValues = {
            create: 'Add Area',
            edit: 'Edit Area: ',
            list: 'Area List',
            imported: 'Imported Areas'
        }
       
        static $inject = ['$scope', '$http', '$state', 'common.notificationService', 'masterDataHelperService', 'areaService', 'importExportService'];
        constructor(private $scope: IAreaScope,
            private $http: ng.IHttpService,
            private $state: ng.ui.IStateService,
            private notificationService: eBmr.common.services.INotificationService,
            private masterDataHelperService: eBmr.common.services.IMasterDataHelperService,
            private areaService: eBmr.services.IareaService,
            private importExportService: eBmr.common.services.IImpotExportService) {
            $scope.vm = this;
            var self = this;
            self.initializeController();
        }
            initializeController() {
                this.headerText = this.headerTextValues.list;
                this.searchObj = {};
                this.areas = [];
                this.stages = [];
                this.unitTypes = [];                
                this.isSaveDisabled = false;
                this.isMasterDataFetched = false;
                this.isMasterDataFetchInProgress = false;  
                this.importParam = false;
                this.exportParam = true; 
                this.selectedArea = null;
                this.fetchMasterData();
                this.fetchAreas();
                this.modelOptions = {
                    getterSetter: true
                };

                    // $scope.fetchAllMasterData();
                }

                fetchMasterData() {
                    var self = this;
            if (!self.unitTypes || self.unitTypes.length == 0) {
                self.masterDataHelperService.getUnitTypes((result)=>self.masterDataCallback(result));
            }

            if (!self.stages || self.stages.length == 0) {
                self.masterDataHelperService.getStages((result) => self.masterDataCallback(result));
            }
        }

        fetchAreas() {
            var self = this;
            if (!self.areas || self.areas.length == 0) {
                self.areaService.getAllArea((result) => self.masterDataCallback(result))
                    .then(
                    function (results) {
                        self.areas = results;
                    },
                    function (error) {
                        console.log('Fetch masterdata failed for area - ' + self.controllerName);
                    }
                    );
            }
        }

        masterDataCallback(result) {
            var self = this;
            if (result.status === eBmrApp.enums.resultStatus.ERROR) {
                self.notificationService.toastAndLogMessage(eBmrApp.enums.messageType.ERROR, 'Fetch masterdata failed for: ' + result.key,undefined);
                return;
            }
            switch (result.key) {
                case this.masterDataHelperService.masterDataEnum.UNITTYPES: self.unitTypes = result.data.data; break;
                case this.masterDataHelperService.masterDataEnum.STAGES: self.stages = result.data.data; break;
            }
        }

        onMasterDataLoaded() {
            var self = this;
            self.isMasterDataFetched = true;
            self.isMasterDataFetchInProgress = false;
        }

        deleteArea(areaModel) {
            var self = this;
            areaModel.markdelete();
            self.areaService.saveAreas([areaModel]).
                then(
                function (results) {
                    //success: 
                    self.areas = Enumerable.From(self.areas).Where(function (x) { return x != areaModel }).ToArray();
                },
                function (error) {
                    console.log('delete failed for areas - ' + self.controllerName);
                }
                )

        }
        editArea(index) {
            var self = this;
            self.isSaveDisabled = false;
            self.selectedArea = self.areas[index];
            var stageFromList = self.selectedArea.stage()
                ? Enumerable.From(self.stages).FirstOrDefault(null, function (x: any) { return x.value === self.selectedArea.stage().value })
                : null;
            stageFromList && self.selectedArea.stage(stageFromList);
            self.isEdit = true;
            self.headerText = self.headerTextValues.edit + self.selectedArea.name(undefined);
           
        }

        createArea() {
            var self = this;
            self.isEdit = false;
            self.selectedArea = self.areaService.newArea();
            self.headerText = self.headerTextValues.create;
        }

        save() {
            var self = this;
            self.isSaveDisabled = true;
            self.areaService.saveAreas([self.selectedArea])
                .then(() => self.saveSuccessCallback(),
                () => self.saveFailedCallback());
        }

        saveImported = function () {
            var self = this;
            self.isSaveDisabled = true;
            self.areaService.saveAreas(self.areas)
                .then(() => self.saveSuccessCallback(),
                () => self.saveFailedCallback());
        };

        saveSuccessCallback() {
            var self = this;
            self.isSaveDisabled = false;
            self.notificationService.toastAndLogMessage(eBmrApp.enums.messageType.SUCCESS, eBmrApp.resources.messages.areaSaveSuccessful,undefined);
            self.showAreaList();
            self.importParam = false;
            self.exportParam = true;
        }


        saveFailedCallback() {
            var self = this;
            self.isSaveDisabled = false;
            self.notificationService.toastAndLogMessage(eBmrApp.enums.messageType.ERROR, eBmrApp.resources.messages.areaSaveFailed,undefined);
        }

        cancel() {
            var self = this;
            self.showAreaList();
        }

        showAreaList() {
            var self = this;
            self.initializeController();
            self.$state.go('area.list');
            self.headerText = self.headerTextValues.list;
        }

        exportCsv() {
            var self = this;
            var dtos = Enumerable.From(self.areas).Select(function (x: eBmr.models.Area) { return x.getAreaDto() }).ToArray();

            var csvDtos = this.getCsvDto(dtos);

            this.importExportService.exportCsv(csvDtos, 'Export_Area.csv', (new eBmr.models.Area()).getAreaDto());
                
        }

        getCsvDto(dtos: any) {
            var self = this;
            var csvDtos = [];

            angular.forEach(dtos, function (dto) {
                var clone = angular.copy(dto);
                var stage:any = Enumerable.From(self.stages).FirstOrDefault(null, function (x: any) { return x._links.self.href === dto.stage });
                clone.stage = stage ? stage.value : '';
                csvDtos.push(clone);
            });
            return csvDtos;
        }

        
        importCsv(files) {
            var self = this;
            self.headerText = self.headerTextValues.imported;

            this.importExportService.importCsv(files, '')
                .then(function (results) {
                    var models: eBmr.models.Area[] = [];
                    if (results.data && results.data.length) {
                        angular.forEach(results.data, function (dto) {
                            var areaDto = new eBmr.dtos.Area(dto);
                            var areaModel = self.areaService.newArea(areaDto);
                            var stage = Enumerable.From(self.stages).FirstOrDefault('', function (x: any) { return x.value === dto.stage });
                            stage && areaModel.stage(stage);
                            models.push(areaModel);
                        });
                    }
                    self.areas = models;
                    self.importParam = true;
                    self.exportParam = false;
                },
                function (error) {

                });
        }
    }

    var app = angular.module('mprApp.areaController', []);
    app.controller('areaController', ['$scope', '$http', '$state', 'common.notificationService', 'masterDataHelperService', 'areaService', 'importExportService', areaController]);
}
