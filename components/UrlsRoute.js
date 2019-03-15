import * as React from 'react'
import { View, ScrollView, StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native'
import { FAB, Button, Paragraph, Dialog, Portal, Text, TextInput, List, Snackbar } from 'react-native-paper'

export default class UrlsRoute extends React.Component {
  state = {
    newUrlDialogVisible: false,
    snackBarVisible: false,
    FABVisible: true,
    newUrlText: 'https://',
    urls: [],
    areUrlsLoading: true,
    requestInterval: '15 minutes',
    responseMessage: ''
  }

  componentDidMount() {
    AsyncStorage.getItem('URLS').then((urls) => {
      urls = urls || '[]'
      this.setState({
        urls: JSON.parse(urls),
        areUrlsLoading: false
      })
      AsyncStorage.getItem('REQUEST_INTERVAL').then((interval) => {
        interval = interval || this.state.requestInterval
      })
    })
  }

  _showNewUrlDialog = () => {
    this.setState({ newUrlDialogVisible: true }) 
  }

  _hideNewUrlDialog = () => {
    this.setState({ newUrlDialogVisible: false })
  }

  _showFAB = () => {
    setTimeout(() => {
      this.setState({ FABVisible: true })
    }, 800)
  }

  _hideFAB = () => {
    this.setState({ FABVisible: false })
  }

  _updateUrlsInStorage = async () => {
    await AsyncStorage.setItem('URLS', JSON.stringify(this.state.urls))
  }

  _deleteUrlFromStorage = async (urlKey) => {
    let urls = this.state.urls
    urls.splice(urls.findIndex(url => url.key === urlKey), 1)
    this.setState({
      urls: urls
    })
    await this._updateUrlsInStorage()
  }

  _addNewUrl = async () => {
    if (this.state.newUrlText.trim() === '') {
      return
    }
    this.state.urls.unshift({key: Math.random(), value: this.state.newUrlText})
    await this._updateUrlsInStorage()
    this.state.newUrlText = 'https://'
    this._hideNewUrlDialog()
  }

  _newUrlTextChangeHandler = (value) => {
    this.setState({
      newUrlText: value
    })    
  }

  _notify = (message) => {
    this.setState({ responseMessage: message, snackBarVisible: true })
  }

  _fetchUrl = (url, onSuccess) => {
    fetch(url).then((response) => {
      this._notify(`${url} have responded ${response.status}`)
    }).catch((error) => {
      this._notify(error.message)
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
              ? (
                  <View style={styles.routeContainer}>
                    <ScrollView onScrollBeginDrag={this._hideFAB} onScrollEndDrag={this._showFAB}>
                      {
                        this.state.urls.map((url) => {
                          return (
                            <List.Item
                              style={styles.listItem}
                              key={url.key.toString()}
                              title={url.value.length > 25 ? url.value.slice(0, 22) + '...' : url.value}
                              left={() => <TouchableOpacity onPress={() => this._fetchUrl(url.value, true)}>
                                <List.Icon icon="link" />
                              </TouchableOpacity>}
                              right={() => <TouchableOpacity onPress={() => this._deleteUrlFromStorage(url.key)}>
                                <List.Icon icon="delete" />
                              </TouchableOpacity>}
                            />
                          )
                        })
                      }
                    </ScrollView></View>
                )
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
          <Dialog visible={this.state.newUrlDialogVisible} onDismiss={this._hideNewUrlDialog}>
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
              <Button onPress={this._addNewUrl}>Add</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Snackbar
          visible={this.state.snackBarVisible}
          onDismiss={() => this.setState({ snackBarVisible: false })}>
          {this.state.responseMessage}
        </Snackbar>
        <FAB
          color="#ffffff"
          style={styles.fab}
          icon="add"
          visible={this.state.FABVisible}
          onPress={() => {this._showNewUrlDialog()}}
        />
      </View>
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
  listLeftIcon: {
    position: 'absolute',
    left: 0
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
