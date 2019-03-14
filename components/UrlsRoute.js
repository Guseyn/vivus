import * as React from 'react'
import { View, FlatList, ListItem, StyleSheet, AsyncStorage } from 'react-native'
import { FAB, Button, Paragraph, Dialog, Portal, Text, TextInput, List } from 'react-native-paper'

export default class UrlsRoute extends React.Component {
  state = {
    visible: false,
    newUrlText: '',
    urls: [],
    areUrlsLoading: true
  }

  componentDidMount() {
    AsyncStorage.getItem('URLS').then((urls) => {
      urls = urls || '[]'
      this.setState({
        urls: JSON.parse(urls),
        areUrlsLoading: false
      })
    })
  }

  _showNewUrlDialog = () => {
    this.setState({ visible: true }) 
  }

  _hideNewUrlDialog = () => {
    this.setState({ visible: false })
  }

  _updateUrlsInStorage = async () => {
    await AsyncStorage.setItem('URLS', JSON.stringify(this.state.urls))
  }

  _deleteUrlFromStorage = async (urlKey) => {
    this.state.urls.splice(this.state.urls.findIndex(url => url.key === urlKey), 1)
    await this._updateUrlsInStorage()
  }

  _addNewUrl = async () => {
    if (this.state.newUrlText.trim() === '') {
      return;
    }
    this.state.urls.push({key: Math.random(), value: this.state.newUrlText})
    await this._updateUrlsInStorage()
    this.state.newUrlText = ''
    this._hideNewUrlDialog()
  }

  _newUrlTextChangeHandler = (value) => {
    this.setState({
      newUrlText: value
    })    
  }

  _outputUrls = () => {
    return (
      <List.Section style={styles.listContainer}>
        <List.Subheader style={styles.infoText}>Urls</List.Subheader>
        {
          this.state.areUrlsLoading 
          ? <Text style={styles.smallInfoText}>Loading...</Text>
          : (
              this.state.urls.length !== 0 
              ? this.state.urls.map((url) => {
                  return (
                    <List.Item
                      key={url.key.toString()}
                      title={url['value']}
                      left={() => <List.Icon icon="link" />}
                    />
                  )
                })
              : <Text style={styles.smallInfoText}> No urls </Text>
            )
        }
      </List.Section>
    )
  }

  render () {
    return (
      <View style={styles.routeContainer}>
        <View style = {styles.listContainer}>
          { this._outputUrls() }
        </View>
        <Portal>
          <Dialog visible={this.state.visible} onDismiss={this._hideNewUrlDialog}>
            <Dialog.Title>Add URL</Dialog.Title>
            <Dialog.Content>
              <TextInput
                style={styles.newUrlInput}
                label="Url"
                value={this.state.newUrlText}
                onChangeText={newUrlText => this._newUrlTextChangeHandler(newUrlText)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._addNewUrl}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <FAB
          color="#ffffff"
          style={styles.fab}
          icon="add"
          onPress={() => {this._showNewUrlDialog()}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  routeContainer: {
    flex: 1
  },
  listContainer: {
    flex: 1,
    position: 'absolute',
    top: 20,
    padding: 5
  },
  infoText: {
    fontSize: 30,
    padding: 15
  },
  smallInfoText: {
    fontSize: 20,
    padding: 25
  },
  fab: {
    backgroundColor: '#6dc17b',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  },
  newUrlInput: {
    backgroundColor: '#ffffff'
  }
})
