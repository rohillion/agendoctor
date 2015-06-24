/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.controller('DashCtrl', ['$scope', 'moment', 'Auth', 'Event', function DashCtrl($scope, moment, Auth, Event) {

        $scope.user = Auth.user;
        
        $scope.calendarView = 'day';
        $scope.calendarDay = new Date();
        $scope.calendarTitle = 'The Calendar';
        $scope.calendarDayName = moment($scope.calendarDay).format('dddd');
        $scope.loaded = false;
        

        var events = Event.all;
        
        events.$loaded(function (items) {
            $scope.loaded = true;
            console.log('loaded:' + $scope.loaded)
            angular.forEach(items, function (event, key) {
                $scope.events.push({
                    title: event.title,
                    type: event.type,
                    startsAt: moment(event.startsAt).toDate(),
                    endsAt: moment(event.endsAt).toDate(),
                    description: event.description,
                });
            });

            events.$watch(function (ref) {
                console.log(ref);
                var event = events.$getRecord(ref.key);
                $scope.events.push({
                    title: event.title,
                    type: event.type,
                    startsAt: moment(event.startsAt).toDate(),
                    endsAt: moment(event.endsAt).toDate(),
                    description: event.description,
                });
            });

        }, function (error) {
            console.log(error);
        });

        $scope.onDrop = function (calendarEvent, starts, ends) {
            calendarEvent.startsAt = starts;
            calendarEvent.endsAt = ends;
        };

    }]);
