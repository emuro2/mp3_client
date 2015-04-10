// var demoApp = angular.module('demoApp', ['demoControllers']);

var TaskManagerApp = angular.module('TaskManagerApp', ['ngRoute', 'Controllers', 'Services']);


TaskManagerApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'UsersController'
        }).
        when('/users/:id', {
            templateUrl: 'partials/userDetails.html',
            controller: 'UserDetailController'
        }).
        when('/addUser', {
            templateUrl: 'partials/addUser.html',
            controller: 'UserAddController'
        }).
        when('/tasks', {
            templateUrl: 'partials/tasks.html',
            controller: 'TasksController'
        }).
        when('/tasks/:id', {
            templateUrl: 'partials/taskDetails.html',
            controller: 'TaskDetailController'
        }).
        when('/addTask', {
            templateUrl: 'partials/addTask.html',
            controller: 'TaskAddController'
        }).
        when('/editTask/:id', {
            templateUrl: 'partials/editTask.html',
            controller: 'TaskEditController'
        }).
        when('/settings', {
            templateUrl: 'partials/settings.html',
            controller: 'SettingsController'
        }).
        otherwise({
            redirectTo: '/settings'
        });
}]);




//demoApp.config(['$routeProvider', function($routeProvider) {
//  $routeProvider.
//    when('/firstview', {
//    templateUrl: 'partials/firstview.html',
//    controller: 'FirstController'
//  }).
//  when('/secondview', {
//    templateUrl: 'partials/secondview.html',
//    controller: 'SecondController'
//  }).
//  when('/settings', {
//    templateUrl: 'partials/settings.html',
//    controller: 'SettingsController'
//  }).
//  when('/llamalist', {
//    templateUrl: 'partials/llamalist.html',
//    controller: 'LlamaListController'
//  }).
//  otherwise({
//    redirectTo: '/settings'
//  });
//}]);