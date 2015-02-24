
!(function () {
    'use strict';

    angular.module('mprApp.importExportService', [])
        .factory('importExportService',
        ['$q', 'common.notificationService',
            function ($q, notificationService) {

                var serviceName = 'importExportService';

                var getFile = function (files) {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            $upload.upload({
                                url: 'upload/url',
                                fields: { 'username': $scope.username },
                                file: file
                            }).progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                            }).success(function (data, status, headers, config) {
                                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                            });
                        }
                    }
                };

                var importCsv = function (files, props) {
                    var deferred = $q.defer();

                    Papa.parse(files[0], {
                        complete: function (results) {
                            console.log("Finished:", results.data);
                            deferred.resolve(results);
                        },
                        error: function(error) {
                            console.log("Parse Error:" + error);
                            deferred.reject(error);
                        },
                        header: true, // first line is header
                        dynamicTyping: true, // boolean and numeric converted to their respective type
                        preview: 0, // if > 0 (say n),  n number of rows parsed
                        skipEmptyLines: true,
                    });

                    return deferred.promise;
                }

                var exportCsv = function (dtos, fileName, newDto) {
                    var cleanedDtos, result;
                    fileName = fileName || "Export.csv";
                    if (dtos && dtos.length) {
                        cleanedDtos = cleanDtoForExport(dtos);
                        result = Papa.unparse(cleanedDtos, {
                            quotes: false,
                            delimiter: ",",
                            newline: "\r\n"
                        });
                    }
                    else {
                        var cleanedDtos = cleanDtoForExport([newDto]);
                        var headers = [];
                        for (var prop in cleanedDtos[0]) {
                            headers.push(prop);
                        }
                        result = headers.join(",");
                        //result = Papa.unparse({
                        //    fields: headers,
                        //    data: []
                        //});
                    }

                 

                    var csvContent = "data:text/csv;charset=utf-8,";
                    //window.open(encodedUri);

                    var encodedUri = encodeURI(csvContent + result);
                    var link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", fileName);

                    link.click();

                }

                var cleanDtoForExport = function (dtos) {
                    var cleanedDtos = [];
                    angular.forEach(dtos, function (dto) {
                        var cleanDto = {};
                        for (var prop in dto) {
                            if ((dto[prop] != null && typeof dto[prop] !== "object") && typeof dto[prop] !== "function" 
                                && prop != 'createdBy' && prop != 'lastModifiedBy' && prop != 'createdDate' && prop != 'lastModifiedDate') {
                                //if($filter('date')(item.date, "dd/MM/yyyy");
                                cleanDto[prop] = dto[prop];
                            }
                        }
                        cleanedDtos.push(cleanDto);
                    });
                    return cleanedDtos;
                }

                return {
                    importCsv: importCsv,
                    exportCsv: exportCsv,
                };


            }]);
})();
