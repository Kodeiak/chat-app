import React, { useEffect, useState } from "react";
import { View, Platform, KeyboardAvoidingView, Text } from "react-native";
import MapView from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import CustomActions from "./CustomActions";

// const firebase = require("firebase");
// require("firebase/firestore");
import { app, db } from "./FirebaseConfig";
// import { initializeApp } from "firebase/app";
import { onSnapshot, collection, addDoc, query, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

const auth = getAuth();


export default function Chat(props) {
  let { name } = props.route.params;
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");
  const [isConnected, setIsConnected] = useState();

  const messagesCollection = collection(db, "messages");

  useEffect(() => {
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });
  }, []); 


  useEffect(() => {

    if (isConnected) {

      console.log("connected");

      const authUnsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          signInAnonymously(auth);
        }

        setUid(user.uid);
      });
      
      const messagesQuery = query(
        messagesCollection,
        orderBy("createdAt", "desc")
      );
      
      let unsubscribe = onSnapshot( messagesQuery, onCollectionUpdate );

      return () => {
        unsubscribe();
        authUnsubscribe();
      }
    } else {
      console.log("not connected");
      getMessages();
    }
  }, [isConnected]);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);
 
  const onCollectionUpdate = (querySnapshot) => {
    let messages = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data();

      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null
      });
    });

    setMessages(
      messages
    );
  };

  const addMessage = (message) => {
    addDoc(messagesCollection, {
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: message.user,
      image: message.image || null,
      location: message.location || null
    })
  }

  const _onPress = () => {
    alert("You tapped the button!")
  };

  const onSend = (messages = []) => {
    addMessage(messages[0]);
    setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
    // saveMessages();
    console.log(AsyncStorage.getItem("messages"));
  };

  const saveMessages = async () => {
    try {
      const jsonMessages = JSON.stringify(messages);
      await AsyncStorage.setItem("messages", jsonMessages);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMessages = async () => {
    let messages = "";
    
    try {
      messages = await AsyncStorage.getItem("messages") || [];
      // console.log(JSON.parse(messages));
      setMessages(JSON.parse(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  }

  // GiftedChat methods
  const renderBubble = (props) => (
    <Bubble 
      {...props}
      wrapperStyle={{ 
        right: {
          backgroundColor: "lightblue"
        },
        left: {
          backgroundColor: "teal"
        }
      }}
      textStyle={{
        right: {
          color: "black",
        },
        left: {
          color: "white",
        },
      }}
    />
  );

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />
    }
  };
  
  const renderCustomActions = (props) => {
    return <CustomActions {...props} />
  };

  // check message for map value and render map view
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return <MapView
        style={{
          width: 150,
          height: 100,
          borderRadius: 13,
          margin: 3
        }}
        region={{
          latitude: currentMessage.location.latitude,
          longitude: currentMessage.location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    }
    return null;
  }

    return (
    <View style={{flex: 1}}>
      <GiftedChat
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id:uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        }}
      />
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="more options"
        acccessibilityHint="Lets you choose to send an image or your geolocation."
        accessibilityRole="button"
        onPress={_onPress}
      >
        {/* <View>
          <Text>Image or geolocation</Text>
        </View> */}
      </TouchableOpacity>
      { Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
  )
}


    // setMessages([
    //   {
    //     _id: 1,
    //     text: "Hello developer",
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: "React Native",
    //       // avatar: "https://placeimg.com/140/140/any"
    //     }
    //   },
    //   {
    //     _id: 2,
    //     text: `${props.route.params.name} has entered the chat`,
    //     createdAt: new Date(),
    //     system: true
    //   },
    // ]);