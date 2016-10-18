angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('ModalService', function ($ionicModal) {
        var initModal = function ($scope,callback) {
            var modal = $ionicModal.fromTemplateUrl('templates/modal.html',{
                scope:$scope,
                animation:'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                return modal
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                callback&&callback()
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            return modal;
        };
        return {
            initModal : initModal
        }

        //var Math = {};
        //function mathFunc (mat){
        //    var math = mat;
        //    math.add = function (a,b) {
        //        return a+b;
        //    };
        //    math.sub = function (a,b) {
        //        return a-b;
        //    }
        //    return math.sub;
        //}
        ////这里需要注意的是mathFunc返回的是减法的函数
        //var sub = mathFunc(Math);
        ////我们这里先使用的是我们最开始定义的Math
        //var sum = Math.add(1,2);
        ////打印出来：3
        //console.log(sum);
        ////这个很好理解的，打印出来：1
        //var AsubB = sub(2,1);
        //console.log(AsubB);
    })