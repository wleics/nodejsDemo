/**
 * 使用angular编写的控制器
 */
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {

  //装载时，通过页面刷新来获取数据
  refreshPage();

  //添加联系人
  $scope.addContact = function () {
    console.log("执行联系人的添加");
    console.log($scope.contact);
    if (!$scope.contact) {
      console.error('非法输入！');
      alert('非法输入！');
      return;
    }
    //发送save请求，将数据写入数据库中
    $http.post('/saveContact', $scope.contact).success(function (response) {
      console.log(response);
      //刷新页面
      refreshPage();
    });
  }

  //添加删除联系人
  $scope.delContact = function (delId) {
    console.log('执行联系人删除，id为:' + delId);
    $http.get('/deletList?id=' + delId).success(function (response) {
      console.log(response);
      refreshPage();

    });
  }

  //编辑联系人
  $scope.editContact = function (editId) {
    console.log('需要编辑的联系人:' + editId);
    $http.get('/getContect?id=' + editId).success(function (response) {
      console.log(response[0]);
      $scope.contact = response[0];

    });
  }

  //更新方法
  $scope.updateContact = function () {
    if (!$scope.contact||!$scope.contact._id) {
      alert('请先选择联系人！');
      return;
    }
    console.log('执行联系人的更新：');
    console.log($scope.contact);
    $http.post('/updateContect', $scope.contact).success(function (response) {
      console.log('联系人更新成功！');
      refreshPage();
    });
  }

  /**
   * 页面刷新
   */
  function refreshPage() {
    $http.get('/contactList').success(function (response) {
      console.log('加载通讯录列表成功！');
      $scope.contactList = response;
      $scope.contact = '';
    });
  }

}]);
