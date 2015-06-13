/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
agendando.controller('DashCtrl', ['$scope', 'Auth', function NavCtrl($scope, Auth) {

        $scope.logout = Auth.logout;
        $scope.user = Auth.user;

        /*$scope.toggleTopicForm = function ($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'app/views/TopicAddCtrlView.html',
                controller: 'TopicAddCtrl',
                targetEvent: $event
            });
        };*/
    }]);
