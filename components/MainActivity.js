import React, { Component } from 'react'
import { View } from 'react-native'
import { BottomNavigation, Text } from 'react-native-paper'
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import UrlsRoute from './UrlsRoute'

const SettingsRoute = () => <Text>Settings</Text>

export default class MainActivity extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'urls', title: 'Urls', icon: 'link', color: '#fff' },
      { key: 'settings', title: 'Settings', icon: 'settings', color: '#fff' }
    ]
  }

  _handleIndexChange = index => this.setState({ index })

  _renderScene = BottomNavigation.SceneMap({
    urls: UrlsRoute,
    settings: SettingsRoute,
  })

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center'}}>
        <BottomNavigation
          navigationState={this.state}
          onIndexChange={this._handleIndexChange}
          renderScene={this._renderScene}
          color={'#ffffff'}
          style={{flex:1}}
          shifting={true}
        />
      </View>
    )
  }
}

