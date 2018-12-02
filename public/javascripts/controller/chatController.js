app.controller("chatController", [
  "$scope",
  "chatFactory",
  "userFactory",
  ($scope, chatFactory, userFactory) => {
    /**
     * initialization
     */

    function init() {
      userFactory.getUser().then(user => {
        $scope.user = user;
      });
    }

    init();

    /**
     * Angular variables
     */

    $scope.onlineList = [];
    $scope.roomList = [];
    $scope.activeTab = 2;
    $scope.chatClicked = false;
    $scope.chatName = "";
    $scope.message = "";
    $scope.roomId = "";
    $scope.messages = [];
    $scope.loadingMessages = false;
    $scope.user = {};

    /**
     * Socket.io event handling.
     */

    const socket = io.connect("http://localhost:3000");

    socket.on("onlineList", users => {
      $scope.onlineList = users;
      $scope.$apply();
    });

    socket.on("hello", () => {
      console.log("hello");
    });

    socket.on("roomList", rooms => {
      $scope.roomList = rooms;
      $scope.$apply();
    });

    socket.on("receiveMessage",messageData =>{

      console.log(messageData);

      $scope.messages[messageData.roomId].push({
        userId: messageData.userId,
        username: messageData.username,
        surname: messageData.surname,
        message: messageData.message
      });
    
      $scope.$apply();

    });

    $scope.newMessage = () => {
      
      if ($scope.message.trim() !== '') {

        socket.emit("newMessage", {
          roomId: $scope.roomId,
          message: $scope.message
        });
  
        $scope.messages[$scope.roomId].push({
          userId: $scope.user._id,
          username: $scope.user.username,
          surname: $scope.user.surname,
          message: $scope.message
        });
  
        $scope.message = "";
        console.log($scope.user);

      }
    };

    $scope.switchRoom = room => {
      $scope.chatName = room.name;
      $scope.roomId = room.Id;
      $scope.chatClicked = true;

      if (!$scope.messages.hasOwnProperty(room.Id)) {
        $scope.loadingMessages = true;
        console.log("Servise bağlanıyor");

        chatFactory.getMessages(room.Id).then(data => {
          $scope.messages[room.Id] = data;
          $scope.loadingMessages = false;
          console.log($scope.messages);
        });
      }
    };

    $scope.newRoom = () => {
      //let randomName = Math.random().toString(36).substring(7);

      let roomName = window.prompt("Enter Room Name");

      if (roomName !== "" && roomName !== "null") {
        socket.emit("newRoom", roomName);
      }
    };

    $scope.changeTab = tab => {
      $scope.activeTab = tab;
    };
  }
]);
