/*global agendoctor, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.factory('Event', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', function ($firebaseArray, $firebaseObject, FIREBASE_URL) {
        var ref = new Firebase(FIREBASE_URL);
        var events = $firebaseArray(ref.child('events').orderByChild("deletedAt").equalTo(false));

        var Event = {
            all: events,
            create: function (event) {
                return events.$add(event).then(function (eventRef) {
                    ref.child('user_events').child(event.authorUID).child(eventRef.key())
                            .set(true);
                    return eventRef;
                });
            },
            get: function (eventId) {
                return $firebaseObject(ref.child('events').child(eventId)).$loaded();
                //return events.$getRecord(eventId);
            },
            delete: function (event) {
                return ref.child('events')
                            .child(event.$id)
                            .child("deletedAt").set(Math.floor(Date.now() / 1000));
            },
            comments: function (eventId) {
                return $firebaseArray(ref.child('comments').child(eventId));
            }
        };

        return Event;
    }]);