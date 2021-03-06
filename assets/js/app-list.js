import angular from 'angular';
import 'app-list/list';
import 'info'
import 'user'

const appList = angular.module('appList', ['app.user', 'appList.list', 'app.info']);

appList.controller('AppListController', function ($scope, $http, $window,
                                                  appList, prompt, alert,
                                                  user) {
  angular.extend($scope, {
    user,
    apps: appList,
    oldApps: appList,
    isOwner(app) {
      if (!user.id) {
        return false;
      }
      if (!app.owner) {
        return true;
      }
      return app.owner.id === user.id;
    },
    isCollaborator(app) {
      if (!user.id) {
        return false;
      }
      if (!app.collaborations) {
        return false;
      }
      return angular.isUndefined(app.collaborations.find(c => c.user.id === user.id));
    },
    saveApps() {
      this.oldApps = angular.copy(this.apps);
    },
    restoreApps() {
      this.apps = this.oldApps;
    },
    createApp() {
      this.saveApps();

      const app = {
        name: this.model.newAppName,
        owner: user
      };

      this.apps.push(app);

      $http.get(`/api/app/create/${app.name}`)
        .success(function (data) {
          app.id = data.id;
        })
        .error((data, error) => {
          this.restoreApps();
          alert.error(`Error while creating the app (${error}): ${data}`);
        });
    },

    renameApp(appId) {
      prompt('New name:').then((newAppName) => {
        this.saveApps();
        this.apps[this.apps.findIndex(app => appId === app.id)].name = newAppName;
        $http.get(`/api/app/rename/${appId}/${newAppName}/`)
          .error((data, error) => {
            this.restoreApps();
            alert.error(`Error while renaming the app (${error}): ${data}`);
          });
      });
    },

    deleteApp(appId, appName) {
      prompt('Type again name of the app to confirm deletion: ').then((confirmName) => {
        if (confirmName !== appName) {
          alert.error('Wrong name, app is not deleted!');
          return;
        }

        this.saveApps();
        this.apps.splice(this.apps.findIndex(app => appId === app.id), 1);
        $http.get(`/api/app/delete/${appId}`).error((data, error) => {
          this.restoreApps();
          alert.error(`Error while deleting the app (${error}): ${data}`);
        });
      });
    }
  });
});

angular.bootstrap(document, ['appList']);
