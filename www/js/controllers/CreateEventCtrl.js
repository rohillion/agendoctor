/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.controller('CreateEventCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', 'calendarTitle', 'Event', function CreateEventCtrl($scope, $ionicModal, moment, Auth, calendarTitle, Event) {

    
        $scope.user = Auth.user;
    
        $scope.loaded = false;
        $scope.time;
    
        $ionicModal.fromTemplateUrl('templates/create_event_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addmodal = modal;
        });
        $scope.createEventModal = function (time) {
            $scope.time = time;
            console.log(calendarTitle.getDay());
            $scope.newEventDate = time + ' ' + calendarTitle.getDay().locale('en').format('dddd') + ' ' + calendarTitle.getDay().date() + ' of ' +calendarTitle.getDay().locale('en').format('MMMM');
            $scope.addmodal.show();
        };
        $scope.createEventModalClose = function () {
            $scope.addmodal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.addmodal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });

        $scope.newEvent = {};
        
        var i = 0, c;
        $scope.addEvent = function () {
            
            var title = $scope.newEvent.title? $scope.newEvent.title.trim() : '';
            var description = $scope.newEvent.description? $scope.newEvent.description.trim() : '';
            
            if (!title.length) {
                console.log('Please fill the title');
                return;
            }
            
            i++;
            c = i + 1;
            
            Event.create({
                title: title,
                type: 'warning',
                //startsAt: '2015-06-26 '+$scope.time,
                startsAt: '2015-06-26 1' + i + ':00',
                endsAt: '2015-06-26 1' + c + ':00',
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
