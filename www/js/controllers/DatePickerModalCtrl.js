/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.controller('DatePickerModalCtrl', ['$scope', '$ionicModal', 'moment', '$cordovaDatePicker', function DatePickerModalCtrl($scope, $ionicModal, moment, $cordovaDatePicker) {
    
        $ionicModal.fromTemplateUrl('templates/modals/datepicker.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.datePickerModal = modal;
        });
    
        /*$scope.showDatePicker = function () {
            $scope.datePickerModal.show();
        };*/
    
        $scope.showDatePicker = function () {
            var options = {
                date: new Date(),
                mode: 'date',
                minDate:  moment().subtract(100, 'years').toDate(),
                allowOldDates: true,
                allowFutureDates: false,
                doneButtonLabel: 'Done',
                doneButtonColor: '#000000',
                cancelButtonLabel: 'Abort',
                cancelButtonColor: '#000000'
            };

            $cordovaDatePicker.show(options).then(function(date){
                alert(date);
            });
        };
    
        $scope.closeDatePicker = function () {
            $scope.datePickerModal.hide();
        };
    
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.datePickerModal.remove();
        });

    }]);
