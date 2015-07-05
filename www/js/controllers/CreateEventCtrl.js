/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.controller('CreateEventCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', 'Event', function CreateEventCtrl($scope, $ionicModal, moment, Auth, Event) {

    
        $scope.user = Auth.user;
    
        $scope.loaded = false;
        $scope.time;
    
        $ionicModal.fromTemplateUrl('templates/modals/create_event.html', {
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
