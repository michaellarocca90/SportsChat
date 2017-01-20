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
import CreateChannel from './pages/createChannel';
import Chat from './pages/chat';
import Participants from './pages/participants';
import BlockList from './pages/blockList';
import GroupChannel from './pages/groupChannel';
import InviteUser from './pages/inviteUser';
import Members from './pages/members';
import SportsChannel from './pages/sportsChannel';


var ROUTES = {
  login: Login,
  openChannel: OpenChannel,
  createChannel: CreateChannel,
  chat: Chat,
  participants: Participants,
  blockList: BlockList,
  groupChannel: GroupChannel,
  inviteUser: InviteUser,
  members: Members,
  sportsChannel: SportsChannel


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