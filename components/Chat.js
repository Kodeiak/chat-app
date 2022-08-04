import React, { Component } from "react";
import { View, Platform, KeyboardAvoidingView, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state={
      messages: []
    }
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        },
        {
          _id: 2,
          text: `${this.props.route.params.name} has entered the chat`,
          createdAt: new Date(),
          system: true
        }
      ]
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble 
        {...props}
        wrapperStyle={{ 
          right: {
            backgroundColor: "#000"
          }
        }}
      />
    );
  }
  
  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id:1
          }}
        />
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="more options"
          acccessibilityHint="Lets you choose to send an image or your geolocation."
          accessibilityRole="button"
          onPress={this._onPress}
        >
          <View>
            <Text>Image or geolocation</Text>
          </View>
        </TouchableOpacity>
        { Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    )
  }
}
