import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  AppState,
  Platform
} from 'react-native';
import {APP_ID} from './consts' 
import OpenChannel from './pages/openChannel'; 
import Login from './pages/login';
import SendBird from 'sendbird';
var ROUTES = {
  login: Login,
  openChannel: OpenChannel
};
 
export default class Main extends Component {
  
  componentDidMount() {
    sb = new SendBird({appId: APP_ID});

    AppState.addEventListener('change', function(currentAppState){
      if (currentAppState === 'active') {
        sb.setForegroundState();
      } else if (currentAppState === 'background') {
        sb.setBackgroundState();
      }
    });
    
  }

  render() {
    return (
      <Navigator
        style={ styles.container }
        initialRoute={ {name: 'login'} }
        renderScene={this._renderScene}
        configureScene={ () => { return Navigator.SceneConfigs.FloatFromRight; } }
      />
    );
  }

  _renderScene(route, navigator) {
    var Component = ROUTES[route.name];
    return ( <Component route={route} navigator={navigator} /> );
  }
};
 
var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});