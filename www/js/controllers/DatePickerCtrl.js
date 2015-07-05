/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.controller('DatePickerCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', 'calendarTitle', 'Event', function DatePickerCtrl($scope, $ionicModal, moment, Auth, calendarTitle, Event) {

    
        $scope.event = {};
        $scope.calendarView = 'day';
        $scope.calendarDay = new Date();
        $scope.time;
        $scope.calendarTitle;
        //$scope.calendarDayName = moment($scope.calendarDay).format('dddd');
        $scope.loaded = false;

        var events = Event.all;
        var event;
        
        //OnLoad events populate calendar array; 
        events.$loaded(function (items) {
            $scope.loaded = true;
            angular.forEach(items, function (event, key) {
                if(!event.deletedAt){
                    $scope.events.push({
                        key: event.$id,
                        title: event.title,
                        type: event.type,
                        startsAt: moment(event.startsAt).toDate(),
                        endsAt: moment(event.endsAt).toDate(),
                        description: event.description,
                        deletedAt: event.deletedAt,
                    });
                }
            });

            //Watch events fbArray for changes
            events.$watch(function (ref) {
                console.log(ref);
                if(ref.event === 'child_added'){
                    event = events.$getRecord(ref.key);
                    $scope.events.push({
                        key: event.$id,
                        title: event.title,
                        type: event.type,
                        startsAt: moment(event.startsAt).toDate(),
                        endsAt: moment(event.endsAt).toDate(),
                        description: event.description,
                        deletedAt: event.deletedAt,
                    });
                }
                
                if(ref.event === 'child_changed'){
                    event = events.$getRecord(ref.key);
                    if(event.deletedAt){
                        $scope.events = [];
                        angular.forEach(events, function (event, key) {
                            if(!event.deletedAt){
                                $scope.events.push({
                                    key: event.$id,
                                    title: event.title,
                                    type: event.type,
                                    startsAt: moment(event.startsAt).toDate(),
                                    endsAt: moment(event.endsAt).toDate(),
                                    description: event.description,
                                    deletedAt: event.deletedAt,
                                });
                            }
                        });
                    }
                }
            });

        }, function (error) {
            console.log(error);
        });
    
        $ionicModal.fromTemplateUrl('templates/datepicker.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.dapickermodal = modal;
        });
    
        //Show datepicker event modal.
        $scope.showDatePicker = function (event) {
            $scope.dapickermodal.show();
        };
    
        $ionicModal.fromTemplateUrl('templates/create_event_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addmodal = modal;
        });
    
        $scope.createEventModal = function (time) {
            $scope.time = time;
            
            $scope.newEventDate = time + ' ' + calendarTitle.getDay().locale('en').format('dddd') + ' ' + calendarTitle.getDay().date() + ' of ' + calendarTitle.getDay().locale('en').format('MMMM');
            $scope.addmodal.show();
        };
        $scope.createEventModalClose = function () {
            $scope.addmodal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.addmodal.remove();
        });

        $scope.newEvent = {};
        
        $scope.addEvent = function () {
            
            var title = $scope.newEvent.title? $scope.newEvent.title.trim() : '';
            var description = $scope.newEvent.description? $scope.newEvent.description.trim() : '';
            
            if (!title.length) {
                console.log('Please fill the title');
                return;
            }
            
            var startsAt = calendarTitle.getDay().format('YYYY-MM-DD ') + $scope.time;
            var endsAt = moment(startsAt).add(30, 'm').format('YYYY-MM-DD HH:mm');
            
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
            $scope.newEvent = {};
            $scope.addmodal.hide();
        }

    }]);
