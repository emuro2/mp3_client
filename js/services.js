
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
                return $http.post(baseUrl + '/api/users', newUser,{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                });
            }
            //put : function (updateUser) {
            //    var baseUrl = $window.sessionStorage.baseurl;
            //    return $http.put(baseUrl + '/api/users', updateUser);
            //}
        }
    })
    .factory('UserDetailService', function($http, $window){
        return {
            get : function(userID) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/users/'+userID);
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
            put : function(task){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.put(baseUrl + '/api/tasks/'+task._id, task);
            },
            getByUser : function(userID){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks?where={"assignedUser":"'+userID+"\",\"completed\":false}");
            },
            getCompTasksByUser : function(userID){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks?where={"assignedUser":"'+userID+"\",\"completed\":true}");
            }
        }
    });

