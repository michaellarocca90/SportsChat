import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import Button from '../components/button'
import SendBird from 'sendbird';
//import TextInput from 'react-native-md-textinput';
var sb = null;
 
export default class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      username: '',
      connectLabel: 'Login',
      buttonDisabled: true,
      errorMessage: ''
    };
    this._onPressConnect = this._onPressConnect.bind(this);
    this._onPressOpenChannel = this._onPressOpenChannel.bind(this);
    this._onPressGroupChannel = this._onPressGroupChannel.bind(this);
    this._onPressSportsChannel = this._onPressSportsChannel.bind(this);
  }

   _onPressConnect() {
    if (!this.state.buttonDisabled) {
      this._onPressDisconnect();
      return;
    }

    if (this.state.username.trim().length == 0 || this.state.userId.trim().length == 0) {
      this.setState({
        userId: '',
        username: '',
        errorMessage: 'User ID and Nickname must be required.'
      });
      return;
    }

    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    if (regExp.test(this.state.username) || regExp.test(this.state.userId)) {
      this.setState({
        userId: '',
        username: '',
        errorMessage: 'Please only alphanumeric characters.'
      });
      return;
    }

    sb = SendBird.getInstance();
    var _SELF = this;
    sb.connect(_SELF.state.userId, function (user, error) {
      if (error) {
        _SELF.setState({
          userId: '',
          username: '',
          errorMessage: 'Login Error'
        });
        console.log(error);
        return;
      }
      
      if (Platform.OS === 'ios') {
        if (sb.getPendingAPNSToken()){
          sb.registerAPNSPushTokenForCurrentUser(sb.getPendingAPNSToken(), function(result, error){
            console.log("APNS TOKEN REGISTER AFTER LOGIN");
            console.log(result);
          });
        }
      } else {
        if (sb.getPendingGCMToken()){
          sb.registerGCMPushTokenForCurrentUser(sb.getPendingGCMToken(), function(result, error){
            console.log("GCM TOKEN REGISTER AFTER LOGIN");
            console.log(result);
          });
        }
      }

      sb.updateCurrentUserInfo(_SELF.state.username, '', function(response, error) {
        _SELF.setState({
          buttonDisabled: false,
          connectLabel: 'Logout',
          errorMessage: ''
        });
      });
    });
  }
  _onPressSportsChannel(){
    
    this.props.navigator.push({name: 'sportsChannel'});
  }

  _onPressOpenChannel() {
    
    this.props.navigator.push({name: 'openChannel'});
  }

   _onPressGroupChannel() {
    this.props.navigator.push({name: 'groupChannel'});
  }

  _onPressDisconnect() {
    sb.disconnect();
    this.setState({
      userId: '',
      username: '',
      errorMessage: '',
      buttonDisabled: true,
      connectLabel: 'Login'
    });
  }

  _buttonStyle() {
    return {
      backgroundColor: '#f44242',
      underlayColor: '#51437f',
      borderColor: '#6E5BAA',
      disabledColor: '#ababab',
      textColor: '#ffffff'
    }
  }

  


  render() {
    return (
      <Image source={require('../img/back.jpg')} style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.bigblue}>SportsChat</Text>
          <Text ></Text>
          <TextInput
            style={styles.input}
            value={this.state.userId}
            onChangeText={(text) => this.setState({userId: text})}
            placeholder={'Enter User ID'}
            maxLength={12}
            multiline={false}
            />
          <TextInput
            style={[styles.input, {marginTop: 10}]}
            value={this.state.username}
            onChangeText={(text) => this.setState({username: text})}
            placeholder={'Enter User Nickname'}
            maxLength={12}
            multiline={false}
            />

          <Button
            text={this.state.connectLabel}
            style={this._buttonStyle()}
            onPress={this._onPressConnect}
          />

          <Text style={styles.errorLabel}>{this.state.errorMessage}</Text>

          
          <Button
            text={'Group Channel'}
            style={this._buttonStyle()}
            disabled={this.state.buttonDisabled}
            onPress={this._onPressGroupChannel}
          />
          <Button
            text={'Sports Channels'}
            style={this._buttonStyle()}
            disabled={this.state.buttonDisabled}
            onPress={this._onPressSportsChannel}
          />
        </View>
      </Image>
    );
  }

  
};
 //'#466368' = purple
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#00BCD4',
    width: null,
    height: null
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#32C5E6',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#328FE6',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#32c5e6'
  },
   bigblue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
  label: {
    width: 230,
    //flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff'
  }
});