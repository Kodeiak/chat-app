import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from 'react-native-maps';

export default function CustomActions(props) {
  const { showActionSheetWithOptions } = useActionSheet();

  [image, setImage] = useState();
  [location, setLocation] = useState();

  // define custom action functions
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    try {
      if (status == "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          props.onSend({
            image: result
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // let user take photo and add to screen
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status == "granted") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status == "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch((error) => console.log(error));
  
        if (!result.cancelled) {
          props.onSend({
            image: result
          });
        }
      }
    }
  }

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status == "granted") {
      let location = await Location.getCurrentPositionAsync({});
      
      if (location) {
        props.onSend({
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        })
      }
    }

  }


  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel"
    ];
    const cancelButtonIndex = options.length - 1;
  
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2: 
            getLocation();
            return;
          default:
        }
      },
    );
  };

  return (
    <TouchableOpacity style={[styles.container]} onPress={onActionPress}>
      <View style={[styles.wrapper]}>
        <Text style={[styles.iconText]}>+</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1
  },
  icontText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};