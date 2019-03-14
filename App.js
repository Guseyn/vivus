import * as React from 'react'
import { AppRegistry, View, Text } from 'react-native'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import MainActivity from './components/MainActivity'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6dc17b',
    accent: '#ffffff',
  },
};

export default class App extends React.Component {
  render () {
    return (
      <PaperProvider theme={theme}>
        <MainActivity/>
      </PaperProvider>
    )
  }
}

AppRegistry.registerComponent('main', () => App)
