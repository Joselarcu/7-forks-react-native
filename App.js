import React, { useEffect } from 'react';
import { YellowBox } from 'react-native';
import * as firebase from 'firebase';
import { firebaseApp } from "./app/utils/firebase";
import Navigation from './app/navigations/Navigation';

YellowBox.ignoreWarnings(['Setting a timer']);

export default function App() {

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
    });
   
  }, []);

  return (
   <Navigation></Navigation>
  );
}


