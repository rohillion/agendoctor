/*global agendoctor, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.factory('EventMiddleman', [function () {

        var events = [];
    
        var EventMiddleman = {
            set: function (scopeEvents) {
                return events = scopeEvents;
            },
            get: function () {
                console.log(events);
                return events;
            }
        };

        return EventMiddleman;
    }]);