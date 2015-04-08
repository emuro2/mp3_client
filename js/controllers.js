var Controllers = angular.module('Controllers', []);



Controllers.controller('UsersController', ['$scope','$http', '$location', 'UsersService', 'UserShared', function($scope, $http, $location ,UsersService,UserShared) {
    var getUsers = function(){
        return UsersService.get().success(function(data){
            $scope.users = data.data;
        })
    };

    getUsers()
        .then(function(){
            $scope.delete = function (userID) {
                UsersService.delete(userID).success(function(){
                    $('#'+userID).css("display","none");
                });
            };
            $scope.addUser = function() {
                $location.path( "/addUser");
            };

            $scope.details = function(userID){
                UserShared.setUserID(userID);
                $location.path("/users/"+userID);
            };
        });
}]);


Controllers.controller('UserAddController', ['$scope','$http', '$location', 'UsersService', function($scope, $http, $location ,UsersService) {
    $scope.user = {name: "", email: ""};

    $(".userForm").submit(function(){
        console.log($scope.user);
        UsersService.post($scope.user).success(function(){
            $(".success").css("display","");
        })
    });
}]);



Controllers.controller('UserDetailController', ['$scope','$http', '$location','UserDetailService', 'UserShared', 'TasksService', 'TaskShared', function($scope, $http, $location, UserDetailService, UserShared, TasksService, TaskShared ) {
    $scope.userID = UserShared.getUserID();
    if (!$scope.userID){
        $scope.userID =$location.path().split("/")[2];
    }


    var getUser = function(){
        return UserDetailService.get($scope.userID).success(function(user){
            $scope.user = user.data;
        });
    };

    getUser()
        .then(function(){
            TasksService.getByUser($scope.user._id).success(function(tasks){
                $scope.pendingTasks = tasks["data"];
            });
        })
        .then(function(){
            $scope.getCompletedTasks = function(){
                TasksService.getCompTasksByUser($scope.user._id).success(function(tasks){
                    $scope.completedTasks = tasks["data"];
                });
            };

            $scope.completeTask = function(taskID){
                var task = $.grep($scope.pendingTasks, function(curr){ return curr._id == taskID; });
                if (task.length==1){
                    task = task[0];
                    //var newTask = {};
                    //newTask["_id"] = task._id;
                    //newTask["__v"] = task.__v;
                    //newTask["assignedUser"] = task.assignedUser;
                    //newTask["assignedUserName"] = task.assignedUserName;
                    //newTask["dateCreated"] = task.dateCreated;
                    //newTask["deadline"] = task.deadline;
                    //newTask["description"] = task.description;
                    //newTask["name"] = task.name;
                    //newTask.completed = true;
                    //console.log(newTask);
                    TasksService.put(task).success(function(){
                        //$('#'+taskID).css("display","none");
                        //
                    });
                }
            };

            $scope.details = function(taskID){
                TaskShared.setTaskID(taskID);
                $location.path("/tasks/"+taskID);
            }
        });
}]);






//
//
//Controllers.controller('TasksController', ['$scope','$http', '$location', 'TasksCommonData' , function($scope, $http, $location,TasksCommonData) {
//    $scope.users = "";
//
//    $scope.getData = function(){
//        $scope.users = TasksCommonData.getData();
//    };
//
//}]);




Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
    $scope.url = $window.sessionStorage.baseurl;

    $scope.setUrl = function(){
        $window.sessionStorage.baseurl = $scope.url;
        $scope.displayText = "URL set";

    };

}]);