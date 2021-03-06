import React, { Component } from 'react'
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet
} from 'react-native'

import {APP_ID, PULLDOWN_DISTANCE} from '../consts';
import SendBird from 'sendbird';
var sb = null;

import TopBar from '../components/topBar';
import Button from '../components/button';

export default class CreateChannel extends Component {
  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    this.state = {
      channelName: '',
      disable: false
    };
    this._onChangeText = this._onChangeText.bind(this);
    this._onBackPress = this._onBackPress.bind(this);
    this._onPressCreateChannel = this._onPressCreateChannel.bind(this);
  }

  _onChangeText(channelName) {
    this.setState({
      channelName: channelName,
      disable: (channelName.trim().length > 0) ? false : true
    });
  }

  _onBackPress() {
    this.props.navigator.pop();
  }

  _onPressCreateChannel() {
    var _SELF = this;
    sb.OpenChannel.createChannel(_SELF.state.channelName, '', '', [sb.currentUser.userId], function (channel, error) {
      if (error) {
        console.log('Create OpenChannel Fail.', error);
        return;
      }
      channel.enter(function(response, error) {
        if (error) {
          console.log('Enter openChannel Fail.', error);
        }
        _SELF.props.navigator.replace({name: 'chat', channel: channel, refresh: _SELF.props.route.refresh});
      })
    });
  }

   _onPressCreateGame(game) { 
    // this.setState({
    //   channelName: game
    // });
    var _SELF = this;
    sb.OpenChannel.createChannel(game, '', '', [sb.currentUser.userId], function (channel, error) {
      if (error) {
        console.log('Create OpenChannel Fail.', error);
        return;
      }
      channel.enter(function(response, error) {
        if (error) {
          console.log('Enter openChannel Fail.', error);
        }
        _SELF.props.navigator.replace({name: 'chat', channel: channel, refresh: _SELF.props.route.refresh});
      })
    });
   
  }

  _buttonStyle() {
    return {
      backgroundColor: '#f44242',
      underlayColor: '#51437f',
      borderColor: '#6E5BAA',
      disabledColor: '#ababab',
      textColor: '#ffffff'
    };
  }


  render() {

    var _SELF = this;
    var gameSchedule = this.props.route.games;
    var gamesToday =[];

    gameSchedule.forEach(function(obj){
      var AwayTeam = obj.AwayTeam;
      gamesToday.push(AwayTeam.concat(' vs ', obj.HomeTeam));
    });
     
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this._onBackPress}
          title='NBA Games Today'
           />
        <View style={styles.createContainer}>
          <ScrollView>
            {gamesToday.map(function(game,i){
              return (
                 <Button
                  key={i}
                  text={game}
                  style={_SELF._buttonStyle()}
                  disabled={_SELF.state.disable}
                  onPress={() => _SELF._onPressCreateGame(game)}
                />
              )
            })}
         </ScrollView>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  createContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 11
  },
  textInput: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#6E5BAA',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
});