/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.controller('DatePickerModalCtrl', ['$scope', '$cordovaDatePicker', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', 'moment', 'Auth', 'Event', 'ShiftsAvailable', function DatePickerModalCtrl($scope, $cordovaDatePicker, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, moment, Auth, Event, ShiftsAvailable) {
    
        $scope.user = Auth.user;
    
        
        var shiftsTaken = [];
        $scope.appointment = {};
        $scope.appointmentDate = moment(new Date());
        $scope.appointmentDateFormated = $scope.appointmentDate.format('dddd D. MMMM');
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
        
            var workingHours = [
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
    
            $scope.shifts = ShiftsAvailable.all(workingHours, shiftsTaken);
            
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
            $scope.scrollFix = $ionicScrollDelegate.$getByHandle('datepickerModalContent').getScrollPosition().top;
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
    
        $scope.addEvent = function () {
            
            var title = $scope.appointment.title? $scope.appointment.title.trim() : '';
            var description = $scope.appointment.description? $scope.appointment.description.trim() : '';
            
            if (!title.length) {
                console.log('Please fill the title');
                return;
            }
            
            var startsAt = $scope.appointmentDate.format('YYYY-MM-DD ') + $scope.newEventShift;
            var endsAt = false;
            
            Event.create({
                title: title,
                type: 'warning',
                startsAt: startsAt,
                endsAt: endsAt,
                description: description,
                deletedAt: false,
                authorUID: Auth.user.uid,
            }).then(function (ref) {
                var id = ref.key();
                console.log("added record with id " + id);
                //events.$indexFor(id); // returns location in the array
            });
            $ionicScrollDelegate.$getByHandle('datepickerModalContent').freezeScroll(true);
            $scope.appointment = {};
            $scope.datePickerModal.hide();
        }

    }]);
