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
var eBmr;
(function (eBmr) {
    var controllers;
    (function (controllers) {
        var areaController = (function () {
            function areaController($scope, $http, $state, notificationService, masterDataHelperService, areaService, importExportService) {
                this.$scope = $scope;
                this.$http = $http;
                this.$state = $state;
                this.notificationService = notificationService;
                this.masterDataHelperService = masterDataHelperService;
                this.areaService = areaService;
                this.importExportService = importExportService;
                this.controllerName = 'areaController';
                this.httpGetParams = [];
                this.rootUrl = eBmrApp.resources.urls.getAllLocations;
                this.headerTextValues = {
                    create: 'Add Area',
                    edit: 'Edit Area: ',
                    list: 'Area List',
                    imported: 'Imported Areas'
                };
                this.saveImported = function () {
                    var self = this;
                    self.isSaveDisabled = true;
                    self.areaService.saveAreas(self.areas).then(function () { return self.saveSuccessCallback(); }, function () { return self.saveFailedCallback(); });
                };
                $scope.vm = this;
                var self = this;
                self.initializeController();
            }
            areaController.prototype.initializeController = function () {
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
            };
            areaController.prototype.fetchMasterData = function () {
                var self = this;
                if (!self.unitTypes || self.unitTypes.length == 0) {
                    self.masterDataHelperService.getUnitTypes(function (result) { return self.masterDataCallback(result); });
                }
                if (!self.stages || self.stages.length == 0) {
                    self.masterDataHelperService.getStages(function (result) { return self.masterDataCallback(result); });
                }
            };
            areaController.prototype.fetchAreas = function () {
                var self = this;
                if (!self.areas || self.areas.length == 0) {
                    self.areaService.getAllArea(function (result) { return self.masterDataCallback(result); }).then(function (results) {
                        self.areas = results;
                    }, function (error) {
                        console.log('Fetch masterdata failed for area - ' + self.controllerName);
                    });
                }
            };
            areaController.prototype.masterDataCallback = function (result) {
                var self = this;
                if (result.status === eBmrApp.enums.resultStatus.ERROR) {
                    self.notificationService.toastAndLogMessage(eBmrApp.enums.messageType.ERROR, 'Fetch masterdata failed for: ' + result.key, undefined);
                    return;
                }
                switch (result.key) {
                    case this.masterDataHelperService.masterDataEnum.UNITTYPES:
                        self.unitTypes = result.data.data;
                        break;
                    case this.masterDataHelperService.masterDataEnum.STAGES:
                        self.stages = result.data.data;
                        break;
                }
            };
            areaController.prototype.onMasterDataLoaded = function () {
                var self = this;
                self.isMasterDataFetched = true;
                self.isMasterDataFetchInProgress = false;
            };
            areaController.prototype.deleteArea = function (areaModel) {
                var self = this;
                areaModel.markdelete();
                self.areaService.saveAreas([areaModel]).then(function (results) {
                    //success: 
                    self.areas = Enumerable.From(self.areas).Where(function (x) {
                        return x != areaModel;
                    }).ToArray();
                }, function (error) {
                    console.log('delete failed for areas - ' + self.controllerName);
                });
            };
            areaController.prototype.editArea = function (index) {
                var self = this;
                self.isSaveDisabled = false;
                self.selectedArea = self.areas[index];
                var stageFromList = self.selectedArea.stage() ? Enumerable.From(self.stages).FirstOrDefault(null, function (x) {
                    return x.value === self.selectedArea.stage().value;
                }) : null;
                stageFromList && self.selectedArea.stage(stageFromList);
                self.isEdit = true;
                self.headerText = self.headerTextValues.edit + self.selectedArea.name(undefined);
            };
            areaController.prototype.createArea = function () {
                var self = this;
                self.isEdit = false;
                self.selectedArea = self.areaService.newArea();
                self.headerText = self.headerTextValues.create;
            };
            areaController.prototype.save = function () {
                var self = this;
                self.isSaveDisabled = true;
                self.areaService.saveAreas([self.selectedArea]).then(function () { return self.saveSuccessCallback(); }, function () { return self.saveFailedCallback(); });
            };
            areaController.prototype.saveSuccessCallback = function () {
                var self = this;
                self.isSaveDisabled = false;
                self.notificationService.toastAndLogMessage(eBmrApp.enums.messageType.SUCCESS, eBmrApp.resources.messages.areaSaveSuccessful, undefined);
                self.showAreaList();
                self.importParam = false;
                self.exportParam = true;
            };
            areaController.prototype.saveFailedCallback = function () {
                var self = this;
                self.isSaveDisabled = false;
                self.notificationService.toastAndLogMessage(eBmrApp.enums.messageType.ERROR, eBmrApp.resources.messages.areaSaveFailed, undefined);
            };
            areaController.prototype.cancel = function () {
                var self = this;
                self.showAreaList();
            };
            areaController.prototype.showAreaList = function () {
                var self = this;
                self.initializeController();
                self.$state.go('area.list');
                self.headerText = self.headerTextValues.list;
            };
            areaController.prototype.exportCsv = function () {
                var self = this;
                var dtos = Enumerable.From(self.areas).Select(function (x) {
                    return x.getAreaDto();
                }).ToArray();
                var csvDtos = this.getCsvDto(dtos);
                this.importExportService.exportCsv(csvDtos, 'Export_Area.csv', (new eBmr.models.Area()).getAreaDto());
            };
            areaController.prototype.getCsvDto = function (dtos) {
                var self = this;
                var csvDtos = [];
                angular.forEach(dtos, function (dto) {
                    var clone = angular.copy(dto);
                    var stage = Enumerable.From(self.stages).FirstOrDefault(null, function (x) {
                        return x._links.self.href === dto.stage;
                    });
                    clone.stage = stage ? stage.value : '';
                    csvDtos.push(clone);
                });
                return csvDtos;
            };
            areaController.prototype.importCsv = function (files) {
                var self = this;
                self.headerText = self.headerTextValues.imported;
                this.importExportService.importCsv(files, '').then(function (results) {
                    var models = [];
                    if (results.data && results.data.length) {
                        angular.forEach(results.data, function (dto) {
                            var areaDto = new eBmr.dtos.Area(dto);
                            var areaModel = self.areaService.newArea(areaDto);
                            var stage = Enumerable.From(self.stages).FirstOrDefault('', function (x) {
                                return x.value === dto.stage;
                            });
                            stage && areaModel.stage(stage);
                            models.push(areaModel);
                        });
                    }
                    self.areas = models;
                    self.importParam = true;
                    self.exportParam = false;
                }, function (error) {
                });
            };
            areaController.$inject = ['$scope', '$http', '$state', 'common.notificationService', 'masterDataHelperService', 'areaService', 'importExportService'];
            return areaController;
        })();
        var app = angular.module('mprApp.areaController', []);
        app.controller('areaController', ['$scope', '$http', '$state', 'common.notificationService', 'masterDataHelperService', 'areaService', 'importExportService', areaController]);
    })(controllers = eBmr.controllers || (eBmr.controllers = {}));
})(eBmr || (eBmr = {}));
//# sourceMappingURL=areaController.js.map