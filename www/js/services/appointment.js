/*global agendoctor, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendoctor.factory('Appointment', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', function ($firebaseArray, $firebaseObject, FIREBASE_URL) {
        var ref = new Firebase(FIREBASE_URL);
        var appointments = $firebaseArray(ref.child('appointments').orderByChild("deletedAt").equalTo(false));

        var Appointment = {
            all: appointments,
            create: function (appointment) {
                return appointments.$add(appointment).then(function (appointmentRef) {
                    ref.child('user_appointments').child(appointment.authorUID).child(appointmentRef.key())
                            .set(true);
                    return appointmentRef;
                });
            },
            get: function (appointmentId) {
                return $firebaseObject(ref.child('appointments').child(appointmentId)).$loaded();
                //return appointments.$getRecord(appointmentId);
            },
            delete: function (appointment) {
                return ref.child('appointments')
                            .child(appointment.$id)
                            .child("deletedAt").set(Math.floor(Date.now() / 1000));
            },
            comments: function (appointmentId) {
                return $firebaseArray(ref.child('comments').child(appointmentId));
            }
        };

        return Appointment;
    }]);