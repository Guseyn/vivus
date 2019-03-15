import * as React from 'react'
import { View, StyleSheet, Picker, AsyncStorage } from 'react-native'
import { List, Switch } from 'react-native-paper'

export default class SettingsRoute extends React.Component {
  state = {
    isSwitchOn: true,
    requestInterval: {
      label: 'minute'
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('IS_SWITCH_ON').then((isSwitchOn) => {
      this.setState({ isSwitchOn: isSwitchOn ? isSwitchOn === 'true' : true })
    })
    AsyncStorage.getItem('REQUEST_INTERVAL').then((interval) => {
      this.setState({ requestInterval: interval ? {label: interval} : { label: 'minute' }})
    })
  }

  _updateIsSwitchOnInStorage = async (isSwitchOn) => {
    this.setState({ isSwitchOn: !isSwitchOn })
    await AsyncStorage.setItem('IS_SWITCH_ON', new Boolean(!isSwitchOn).toString())
  }

  _updateRequestIntervalStorage = async (interval) => {
    this.setState({ requestInterval: {label: interval} })
    await AsyncStorage.setItem('REQUEST_INTERVAL', interval)
  }

  render() {
    const { isSwitchOn } = this.state
    return (
      <List.Section style={styles.listContainer}>
        <List.Subheader style={styles.infoText}>Settings</List.Subheader>
        <List.Item
          style={styles.listItem}
          title={'Turned ' + (isSwitchOn ? 'On' : 'Off')}
          right={() => <Switch
            value={isSwitchOn}
            color='#6dc17b'
            onValueChange={() => {
                this._updateIsSwitchOnInStorage(isSwitchOn)
              }
            }
          />}
        />
        <List.Item
          style={styles.listItem}
          title={'Send requests every '}
          right={
            () => <Picker
              selectedValue={this.state.requestInterval.label}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              enabled={this.state.isSwitchOn}
              onValueChange={
                (itemValue, itemIndex) => {
                  this._updateRequestIntervalStorage(itemValue)
                }
              }
            >
              <Picker.Item label="minute" value="minute" />
              <Picker.Item label="5 minutes" value="5 minutes" />
              <Picker.Item label="30 minutes" value="30 minutes" />
              <Picker.Item label="hour" value="hour" />
              <Picker.Item label="5 hours" value="5 hours" />
              <Picker.Item label="24 hours" value="24 hours" />
            </Picker>
          }
        />
      </List.Section>
    )
  }
}

const styles = StyleSheet.create({
  routeContainer: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  listContainer: {
    flex: 1,
    position: 'absolute',
    paddingTop: 20,
    width: '100%',
    height: '100%'
  },
  listItem: {
    width: '100%'
  },
  picker: {
    height: 50,
    width: 120
  },
  pickerItem: {
    fontSize: 25
  },
  infoText: {
    fontSize: 30,
    padding: 15
  }
})

