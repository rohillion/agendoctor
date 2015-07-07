/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.controller('DatePickerModalCtrl', ['$scope', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', 'moment', 'Event', '$cordovaDatePicker', function DatePickerModalCtrl($scope, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, moment, Event, $cordovaDatePicker) {
    
        var shiftsAvailable,shiftAvailable;
        var shiftMinutes = 30;
        var shiftsTaken = [];
        $scope.newEventDate = moment(new Date()).format('dddd D. MMMM');
        $scope.newEventShift = '';
    
        $scope.shifts = [];
    
        var events = Event.all;
        
        //OnLoad events populate calendar array;
        events.$loaded(function (items) {
            $scope.loaded = true;
            angular.forEach(items, function (event, key) {
                if(!event.deletedAt){
                    shiftsTaken.push(moment(event.startsAt).format('YYYYMMDDHHmm'));
                }
            });
            shiftsTaken.push('201507060930');
            shiftsTaken.push('201507061030');
        
            var shiftsHours = [
                {
                    monday: [
                        {
                            from:'08:00',
                            to:'12:00'
                        },{
                            from:'14:00',
                            to:'16:00'
                        }
                    ]
                },{
                    wednesday: [
                        {
                            from:'08:00',
                            to:'12:00'
                        }
                    ]
                }
            ];
    
            angular.forEach(shiftsHours, function (dayShifts) {

                angular.forEach(dayShifts, function (shifts, dayName) {

                    //console.log(dayName);
                    $scope.shifts[dayName] = [];

                    angular.forEach(shifts, function (shift,i) {
                        //i++;

                        //calculate differnce between to and from shift hours.
                        shiftsAvailable = moment(shift.to,"HH:mm").diff(moment(shift.from,"HH:mm"), 'minutes') / shiftMinutes;

                        //console.log( 'Franja '+i+': '+ shiftsAvailable +' turnos' );

                        shiftAvailable = moment(shift.from,"HH:mm");

                        for(var s = 1; s <= shiftsAvailable; s++){
                            //console.log('Turno: '+ shiftAvailable.format("HH:mm"));

                            if(shiftsTaken.indexOf(shiftAvailable.format("YYYYMMDDHHmm")) === -1)
                                $scope.shifts[dayName].push(shiftAvailable.format("HH:mm"));
                            shiftAvailable = moment(shiftAvailable,"HH:mm").add(shiftMinutes, 'minutes');
                        }
                    });
                });
            });

            console.log($scope.shifts);
    
        });
    
        $ionicModal.fromTemplateUrl('templates/modals/datepicker.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.datePickerModal = modal;
			$scope.datePickerModalSlider = $ionicSlideBoxDelegate.$getByHandle('modalSlider');
			$scope.datePickerModalSlider.enableSlide(false);
        });
    
        $scope.showDatePicker = function () {
            $scope.datePickerModalSlider.slide(0);
			$scope.itemSelected = false;	
			$scope.datePickerModal.show();
        };
    
        $scope.selectShift = function(shift) {
            $scope.newEventShift = shift;
            $ionicSlideBoxDelegate.$getByHandle('modalSlider').next();
            //console.log($ionicScrollDelegate.$getByHandle('datepickerModalContent').getScrollPosition());
            $scope.scrollFix = $ionicScrollDelegate.$getByHandle('datepickerModalContent').getScrollPosition().top;
            //$ionicScrollDelegate.$getByHandle('datepickerModalContent').getScrollPosition().top;
            $ionicScrollDelegate.$getByHandle('datepickerModalContent').freezeScroll(true);
		};
    
        /*$scope.showDatePicker = function () {
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
        };*/
    
        $scope.closeDatePicker = function () {
            if ($scope.datePickerModalSlider.currentIndex() == 0){
				$scope.datePickerModal.hide();
            }else{
				$scope.datePickerModalSlider.previous();
                $ionicScrollDelegate.$getByHandle('datepickerModalContent').freezeScroll(false);
            }
        };
    
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.datePickerModal.remove();
        });

    }]);
