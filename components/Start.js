import React, { Component } from "react";
import { View, Text, TextInput, Pressable, ImageBackground } from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    }
  }

  // handleInput = (value) => {
  //   console.log(value);
  //   // value = event.target.value;
  //   this.state = {
  //     name: value
  //   }
  // }
 
  
  render() {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ImageBackground source={require("../img/background.png")} resizeMode="cover" style={{flex: 1, justifyContent: "center", width: 400}}>
          <View style={{flex: .48, alignItems: "center", marginTop: 60}}>
            <Text
              style={{fontSize: 45, fontWeight: "600", color: "#fff"}}
            >ChatItUp</Text>
          </View>
          <View style={{flex: .50, justifyContent: "space-between", backgroundColor: "white", width: 350, height: 150, margin: 25}}>
            <TextInput
              style={{flex: .6, margin: 15, borderColor: "black", borderWidth: 1, padding: 10}}
              onChangeText={name => this.setState({name})}
              value={this.state.name}
              placeholder="Your Name"
            ></TextInput>
            <View style={{flex: 2, paddingTop: 15}}>
              <Text style={{fontSize: 16, fontWeight: "500", color: "#757083", marginLeft: 15, marginBottom: 10}}>Choose Background Color</Text>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly"}}>
                <View style={{backgroundColor: "#090C08", width: 50, height: 50, borderRadius: 50/2}}></View>
                <View style={{backgroundColor: "#474056", width: 50, height: 50, borderRadius: 50/2}}></View>
                <View style={{backgroundColor: "#8A95A5", width: 50, height: 50, borderRadius: 50/2}}></View>
                <View style={{backgroundColor: "#B9C6AE", width: 50, height: 50, borderRadius: 50/2}}></View>
              </View>
            </View>
            <View style={{flex: 1, margin: 15, height: 50 }}>
              <Pressable 
                onPress={() => this.props.navigation.navigate("Chat", {name: this.state.name})}
                style={{backgroundColor: "#757083", flex: 1, justifyContent: "center", alignItems: "center"}}
              >
                <Text style={{fontSize: 16, fontWeight: "600", color: "#FFF"}}>
                  Start Chatting
                </Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
}