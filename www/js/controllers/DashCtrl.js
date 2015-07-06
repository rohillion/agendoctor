/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.controller('DashCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', 'Event',function DashCtrl($scope, $ionicModal, moment, Auth, Event) {

        $scope.user = Auth.user;
        
        $scope.time;
        $scope.loaded = false;
        $scope.events = [];

        var events = Event.all;
        
        //OnLoad events populate calendar array; 
        events.$loaded(function (items) {
            $scope.loaded = true;
            angular.forEach(items, function (event, key) {
                if(!event.deletedAt){
                    $scope.events.push({
                        key: event.$id,
                        title: event.title,
                        type: event.type,
                        date: event.startsAt,
                        startsAt: moment(event.startsAt).format('dddd D. MMMM'),
                        //endsAt: moment(event.endsAt).toDate(),
                        //startsTime: parseInt(moment(event.startsAt).format('HHmm')),
                        startsTime: moment(event.startsAt).format('HH:mm'),
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
    
        
        $ionicModal.fromTemplateUrl('templates/modals/edit_event.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.editmodal = modal;
        });
    
        //Show edit event modal.
        $scope.eventClicked = function (event) {
            $scope.event = event;
            $scope.event.eventDate = moment(event.startsAt).format('HH:mm') + ' ' + calendarTitle.getDay().locale('en').format('dddd') + ' ' + calendarTitle.getDay().date() + ' of ' + calendarTitle.getDay().locale('en').format('MMMM');
            $scope.editmodal.show();
        };
    
        //Close edit event modal.
        $scope.editEventModalClose = function () {
            $scope.editmodal.hide();
        };
    
        //Remove edit event modal from DOM.
        $scope.$on('$destroy', function () {
            $scope.editmodal.remove();
        });
        
        //Save changes to event.
        $scope.saveEvent = function () {
            
            var title = $scope.event.title? $scope.event.title.trim() : '';
            var description = $scope.event.description? $scope.event.description.trim() : '';
            
            if (!title.length) {
                console.log('Please fill the title');
                return;
            }
            
            Event.edit($scope.event);
            $scope.event = {};
            $scope.editmodal.hide();
        }
        
        $scope.deleteEvent = function(){
            Event.delete($scope.event);
            //$scope.events.splice($scope.events.indexOf($scope.event), 1);
            $scope.event = {};
            $scope.editmodal.hide();
        }

    }]);
