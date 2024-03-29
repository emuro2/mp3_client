var Controllers = angular.module('Controllers', []);



Controllers.controller('UsersController', ['$scope','$http', '$q', '$location', 'UsersService', 'UserShared', function($scope, $http, $q, $location ,UsersService,UserShared) {
    UsersService.get().success(function(data){
        $scope.users = data.data;
    });

    $scope.delete = function(userID) {
        var promises = [];
        promises.push(UsersService.delete(userID));
        promises.push(UsersService.getUserTasks(userID));
        $q.all(promises)
        .then(function(data){
            var updateTasks = data[1]["data"]["data"];
            var promises=[];
            angular.forEach(updateTasks, function(task){
                task.assignedUser = "";
                task.assignedUserName = "unassigned";
                promises.push(UsersService.putUserTask(task));
            });
            return $q.all(promises);
        })
        .then(function(){
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

}]);


Controllers.controller('UserAddController', ['$scope','$http', '$location', 'UsersService', function($scope, $http, $location ,UsersService) {
    $scope.user = {name: "", email: ""};
    var nameValid = false;
    var emailValid = false;

    $scope.$watch(
        function() {return $scope.user.name; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {

                if (!$scope.user.name || $scope.user.name.length < 1 ){
                    $(".nameError").css("display","");
                    nameValid = false;
                }
                else{
                    $(".nameError").css("display","none");
                    nameValid = true;
                }
            }
        }
    );
    $scope.$watch(
        function() {return $scope.user.email; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {

                if (!$scope.user.email || $scope.user.email.length < 1){
                    $(".emailError").css("display","");
                    $(".emailError div h3").text("Required!");
                    emailValid = false;
                }
                else if($scope.user.email.indexOf("@")< 0){
                    $(".emailError").css("display","");
                    $(".emailError div h3").text("@ Required!");
                    emailValid = false;
                }
                else{
                    $(".emailError").css("display","none");
                    emailValid = true;
                }
            }
        }
    );


    $(".userForm").submit(function(){
        if(emailValid && nameValid) {
            UsersService.post($scope.user).success(function (data) {
                $(".response").css("display", "");
                $(".response div").css("background-color", "#43AC6A");
                $(".response div h3").text(data.message);
            })
            .error(function (data) {
                $(".response").css("display", "");
                $(".response div").css("background-color", "#cc0000");
                $(".response div h3").text(data.message);
            })
        }
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
                task.completed = true;
                TasksService.put(task).success(function(){
                    $('#'+taskID).css("display","none");
                });
            }
        };

        $scope.details = function(taskID){
            TaskShared.setTaskID(taskID);
            $location.path("/tasks/"+taskID);
        };
    });
}]);








Controllers.controller('TasksController', ['$scope','$http', '$location','$q', 'TasksService', 'TaskShared', 'UserDetailService' , function($scope, $http, $location, $q,TasksService, TaskShared, UserDetailService) {

    $scope.option = "pending";
    $scope.ascending= "true";
    $scope.sortBy = "name";
    var skip = 0;
    $scope.query = "";

    $scope.updateQuery = function(skipNum){
        switch ($scope.option){
            case "pending":
                $scope.query = "?where={\"completed\":false}&select={\"_id\":1,\"name\":1,\"assignedUserName\":1, \"deadline\":1}";
                break;
            case "completed":
                $scope.query = "?where={\"completed\":true}&select={\"_id\":1,\"name\":1,\"assignedUserName\":1, \"deadline\":1}";
                break;
            case "all":
                $scope.query = "?select={\"_id\":1,\"name\":1,\"assignedUserName\":1, \"deadline\":1}";
                break;
            default:
                $scope.query ="?where={\"completed\":false}&select={\"_id\":1,\"name\":1,\"assignedUserName\":1, \"deadline\":1}";
        }
        switch ($scope.ascending){
            case "true":
                $scope.query = $scope.query+"&sort={\""+$scope.sortBy+"\":1}&skip="+skipNum+"&limit=10";
                break;
            case "false":
                $scope.query = $scope.query+"&sort={\""+$scope.sortBy+"\":-1}&skip="+skipNum+"&limit=10";
                break;
            default:
                $scope.query = $scope.query+"&sort={\"name\":1}&skip=0&limit=10";
        }
    };

    $scope.updateQuery(0);
    TasksService.get($scope.query).success(function(data){
        $scope.tasks = data.data;
        if($scope.tasks.length < 10){
            $('#Next').removeClass().addClass("button disabled secondary round right");
        }
    });

    $scope.$watch(
        function() { return $scope.query; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                TasksService.get($scope.query).success(function(data){
                    $scope.tasks = data.data;
                    if($scope.query.split("skip=")[1][0]==="0") {
                        skip = 0;
                        $('#Previous').removeClass().addClass("button disabled secondary round left");
                    }
                    if ($scope.tasks.length < 10) {
                        $('#Next').removeClass().addClass("button disabled secondary round right");
                    }
                    else
                        $('#Next').removeClass().addClass("button info round right");
                });
            }
        }
    );

    $scope.$watch(
        function() { return $scope.sortBy; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue )
                $scope.updateQuery(0);
        }
    );

    $scope.pagination = function(event){
        var button = $(event.target);

        if(button.attr('id') === "Previous"){
            if(button.attr('class').indexOf("disabled") < 0) {
                skip = skip-10;
                $scope.updateQuery(skip);
                $("#Next").removeClass().addClass("button info round right");
                if(skip ===0){
                    button.removeClass().addClass("button disabled secondary round left");
                }
            }
        }
        else{
            if(button.attr('class').indexOf("disabled") < 0) {
                skip = skip+10;
                $scope.updateQuery(skip);
                $("#Previous").removeClass().addClass("button info round left");
            }
        }
    };

    $scope.addTask = function() {
        $location.path( "/addTask");
    };

    $scope.details = function(taskID){
        TaskShared.setTaskID(taskID);
        $location.path("/tasks/"+taskID);
    };



    $scope.delete = function(task){

        if(task.assignedUserName !== "unassigned"){
            var promises = [];
            promises.push(TasksService.delete(task._id));
            promises.push(UserDetailService.getByName(task.assignedUserName));
            $q.all(promises)
                .then(function(data){
                    var updateUser = data[1]["data"]["data"][0];
                    var promises=[];
                    angular.forEach(updateUser.pendingTasks, function(delTaskID){
                        if (delTaskID === task._id.toString())
                        {
                            var index = updateUser.pendingTasks.indexOf(delTaskID);
                            updateUser.pendingTasks.splice(index, 1);
                        }
                    });
                    promises.push(UserDetailService.putUser(updateUser));
                    return $q.all(promises);
                })
                .then(function(){
                    $('#'+task._id).css("display","none");
                });
        }
        else{
            TasksService.delete(task._id).success(function(){
                $('#'+task._id).css("display","none");
            });
        }

    };
}]);



Controllers.controller('TaskDetailController', ['$scope', '$location', 'TasksService','TaskShared' , function($scope, $location, TasksService, TaskShared) {
    $scope.taskID = TaskShared.getTaskID();
    if (!$scope.taskID){
        $scope.taskID =$location.path().split("/")[2];
    }

    var getTask = function(){
        return TasksService.getTask($scope.taskID).success(function(task){
            $scope.task = task.data;
        });
    };

    getTask();

    $scope.editTask = function(){
        $location.path("/editTask/"+$scope.taskID);
    }
}]);



Controllers.controller('TaskAddController', ['$scope','$http', '$q','$location', 'TasksService', 'UsersService', 'UserDetailService', function($scope, $http, $q, $location ,TasksService, UsersService, UserDetailService) {
    $scope.task = {name: "", description: "", deadline: "", completed: false, assignedUser:"", assignedUserName:"unassigned",dateCreated:""};
    var nameValid = false;
    var deadlineValid = false;

    UsersService.get().success(function(data){
        $scope.users = data.data;
    });

    $scope.$watch(
        function() {return $scope.task.name; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                if (!$scope.task.name || $scope.task.name.length < 1 ){
                    $(".nameError").css("display","");
                    nameValid = false;
                }
                else{
                    $(".nameError").css("display","none");
                    nameValid = true;
                }
            }
        }
    );
    $scope.$watch(
        function() {return $scope.task.deadline; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                if (!$scope.task.deadline || $scope.task.deadline.length < 1){
                    $(".deadlineError").css("display","");
                    $(".dealineError div h3").text("Required!");
                    deadlineValid = false;
                }
                else{
                    $(".deadlineError").css("display","none");
                    deadlineValid = true;
                }
            }
        }
    );


    $(".taskForm").submit(function(){
        if(deadlineValid && nameValid) {
            if ($scope.task.assignedUserName === "unassigned" || $scope.task.assignedUserName.length<1){
                $scope.task.assignedUserName = "unassigned";
                TasksService.post($scope.task).success(function(){
                    $(".response").css("display", "");
                    $(".response div").css("background-color", "#43AC6A");
                    $(".response div h3").text("Added Task!");
                });
            }
            else {
                $scope.task.assignedUser= $scope.task.assignedUserName["_id"];
                $scope.task.assignedUserName= $scope.task.assignedUserName["name"];
                var promises = [];
                var userID = "";
                angular.forEach($scope.users, function(user){
                    if ($scope.task.assignedUserName === user.name) {
                        userID = user._id;
                    }
                });

                promises.push(TasksService.post($scope.task));
                promises.push(UserDetailService.get(userID));
                $q.all(promises)
                .then(function(data){
                    var updateTask = data[0]["data"]["data"];
                    var updateUser = data[1]["data"]["data"];

                    updateUser.pendingTasks.push(updateTask._id);
                    return UserDetailService.putUser(updateUser);
                })
                .then(function () {
                    $(".response").css("display", "");
                    $(".response div").css("background-color", "#43AC6A");
                    $(".response div h3").text("Added Task!");
                    },
                    function (data) {
                        $(".response").css("display", "");
                        $(".response div").css("background-color", "#cc0000");
                        $(".response div h3").text(data.message);
                });
            }
        }
    });
}]);


Controllers.controller('TaskEditController', ['$timeout','$scope','$q', '$location', 'TasksService','TaskShared','UsersService','UserDetailService' , function($timeout,$scope,$q, $location, TasksService, TaskShared,UsersService,UserDetailService) {
    $scope.taskID = TaskShared.getTaskID();
    if (!$scope.taskID){
        $scope.taskID =$location.path().split("/")[2];
    }

    var nameValid = true;
    var deadlineValid = true;



    var getTask = function(){
        return TasksService.getTask($scope.taskID).success(function(task){
            $scope.task = task.data;
            $scope.task.deadline = new Date($scope.task.deadline);
            $scope.prevAssignedUserName = $scope.task.assignedUserName;
        });
    };



    TasksService.getTask($scope.taskID)
    .then(function(task){
        $scope.task = task.data.data;
        $scope.task.deadline = new Date($scope.task.deadline);
        $scope.prevAssignedUserName = $scope.task.assignedUserName;

        $scope.$watch(
            function() {return $scope.task.name; },
            function(newValue, oldValue) {
                if ( newValue !== oldValue ) {
                    if (!$scope.task.name || $scope.task.name.length < 1 ){
                        $(".nameError").css("display","");
                        nameValid = false;
                    }
                    else{
                        $(".nameError").css("display","none");
                        nameValid = true;
                    }
                }
            }
        );
        $scope.$watch(
            function() {return $scope.task.deadline; },
            function(newValue, oldValue) {
                if ( newValue !== oldValue ) {
                    if (!$scope.task.deadline || $scope.task.deadline.length < 1){
                        $(".deadlineError").css("display","");
                        $(".dealineError div h3").text("Required!");
                        deadlineValid = false;
                    }
                    else{
                        $(".deadlineError").css("display","none");
                        deadlineValid = true;
                    }
                }
            }
        );

    });

    UsersService.get()
        .then(function(data){
            $scope.users = data.data.data;
        });


    $(".taskForm").submit(function(){
        if(deadlineValid && nameValid) {
            if ($scope.task.assignedUserName === "unassigned" || $scope.task.assignedUserName.length<1){
                $scope.task.assignedUserName = "unassigned";
                TasksService.put($scope.task).success(function(){
                    $(".response").css("display", "");
                    $(".response div").css("background-color", "#43AC6A");
                    $(".response div h3").text("Task Updated!");
                });
            }
            else {

                $scope.task.assignedUserName= $scope.task.assignedUserName;
                var promises = [];
                var userID = "";
                angular.forEach($scope.users, function(user){
                    if ($scope.task.assignedUserName === user.name) {
                        userID = user._id;
                        $scope.task.assignedUser= user._id;
                    }
                });

                promises.push(TasksService.put($scope.task));
                promises.push(UserDetailService.get(userID));
                $q.all(promises)
                    .then(function(data){
                        var updateTask = data[0]["data"]["data"];
                        var updateUser = data[1]["data"]["data"];

                        updateUser.pendingTasks.push(updateTask._id);
                        return UserDetailService.putUser(updateUser);
                    })
                    .then(function () {
                        $(".response").css("display", "");
                        $(".response div").css("background-color", "#43AC6A");
                        $(".response div h3").text("Task Updated!");
                    },
                    function (data) {
                        $(".response").css("display", "");
                        $(".response div").css("background-color", "#cc0000");
                        $(".response div h3").text(data.message);
                    });
            }
        }
    });

   $timeout(function(){
       $("option:selected").removeAttr("selected")

       $("#select option").filter(function() {

           if (this.label === $scope.task.assignedUserName) {
               return this;
           }
       }).prop('selected', true);

   },250);


}]);


Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
    $scope.url = $window.sessionStorage.baseurl;

    $scope.setUrl = function(){
        $window.sessionStorage.baseurl = $scope.url;
        $scope.displayText = "URL set";

    };

}]);