import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage";

import { app, db } from "./FirebaseConfig";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const storage = getStorage();

export default function CustomActions(props) {
  const { showActionSheetWithOptions } = useActionSheet();

  [image, setImage] = useState();
  [location, setLocation] = useState();

  // add image to firebase then return image's firebase uri
  const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log("xhr failed");
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore - 1];

    const imageRef = ref(storage, `images/${imageName}`);

    return uploadBytes(imageRef, blob).then( async (snapshot) =>{
      blob.close();
      return getDownloadURL(snapshot.ref)
        .then((url) => {
          console.log(url);
          return url;
        })
        .catch((error) => {
          console.log("failed uploadBytes", error);
        })
    });
  }

  // define custom action functions
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    try {
      if (status == "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await uploadImage(result.uri);
          props.onSend({
            image: imageUrl
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
          const photoUrl = await uploadImage(result.uri);
          props.onSend({
            image: photoUrl
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
    <TouchableOpacity 
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Let’s you choose to send an image or your geolocation."
      style={[styles.container]} 
      onPress={onActionPress}
    >
      <View style={[styles.wrapper, props.wrapperStyle]}>
        <Text style={[styles.iconText, props.iconTextStyle]}>+</Text>
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