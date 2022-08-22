import React, { useEffect, useState } from "react";
import { View, Platform, KeyboardAvoidingView, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// const firebase = require("firebase");
// require("firebase/firestore");
import { initializeApp } from "firebase/app";
import { doc, onSnapshot, getFirestore, collection, addDoc, query, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4aNoVrNn8nECgPJk66j-fmXZJ-aduvcQ",
  authDomain: "test-65934.firebaseapp.com",
  projectId: "test-65934",
  storageBucket: "test-65934.appspot.com",
  messagingSenderId: "997041391762",
  appId: "1:997041391762:web:13c476cb0bc1493a7e3e4b",
  measurementId: "G-3D68KQ28DD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


export default function Chat(props) {
  let { name } = props.route.params;
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");

  const messagesCollection = collection(db, "messages");

  useEffect(() => {

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
  }, []);
  
  const onCollectionUpdate = (querySnapshot) => {
    let messages = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data();

      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
    });
    console.log(messages);
    setMessages(
      messages
    );
  };

  const addMessage = (message) => {
    console.log(message);
    addDoc(messagesCollection, {
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: message.user
      // image: message.image || null,
      // location: message.location || null
    })
  }

  const _onPress = () => {
    alert("You tapped the button!")
  }

  const onSend = (messages = []) => {
    addMessage(messages[0]);
    setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
  }

  const renderBubble = (props) => (
    <Bubble 
      {...props}
      wrapperStyle={{ 
        right: {
          backgroundColor: "#000"
        }
      }}
    />
  );
  
    return (
    <View style={{flex: 1}}>
      <GiftedChat
        renderBubble={renderBubble}
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
        <View>
          <Text>Image or geolocation</Text>
        </View>
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