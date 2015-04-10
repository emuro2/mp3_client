
//js/services/todos.js
angular.module('Services', [])
    .factory('UserShared', function(){
        var selectedUserID = "";
        return{
            getUserID : function(){
                return selectedUserID;
            },
            setUserID : function(userID){
                selectedUserID = userID;
            }
        }
    })
    .factory('UsersService', function($http, $window){
        return {
            get : function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/users?select={"_id":1, "name":1}');
            },

            delete : function (userID) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.delete(baseUrl + '/api/users/'+userID);
            },
            post : function (newUser) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.post(baseUrl + '/api/users', $.param(newUser),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            getUserTasks : function(userID){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks?where={"assignedUser":"'+userID+"\"}");
            },
            putUserTask : function(task){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.put(baseUrl + '/api/tasks/'+task._id, $.param(task),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        }
    })
    .factory('UserDetailService', function($http, $window){
        return {
            get : function(userID) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/users/'+userID);
            },
            getByName : function(userName){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/users?where={"name":\"'+userName+"\"}");
            },
            putUser : function(user){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.put(baseUrl + '/api/users/'+user._id, $.param(user),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        }
    })








    .factory('TaskShared', function(){
        var selectedTaskID = "";
        return{
            getTaskID : function(){
                return selectedTaskID;
            },
            setTaskID : function(taskID){
                selectedTaskID = taskID;
            }
        }
    })
    .factory('TasksService', function($http, $window){
        return{
            get : function(query){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks'+query);
            },
            getTask : function(taskID){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks/'+taskID);
            },
            post : function (task) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.post(baseUrl + '/api/tasks', $.param(task),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            put : function(task){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.put(baseUrl + '/api/tasks/'+task._id, $.param(task),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            getByUser : function(userID){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks?where={"assignedUser":"'+userID+"\",\"completed\":false}");
            },
            getCompTasksByUser : function(userID){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks?where={"assignedUser":"'+userID+"\",\"completed\":true}");
            },
            delete : function (taskID) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.delete(baseUrl + '/api/tasks/'+taskID);
            }
        }
    });

