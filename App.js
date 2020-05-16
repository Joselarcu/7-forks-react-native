import React, { useEffect } from 'react';
import { YellowBox } from 'react-native';
import * as firebase from 'firebase';
import Navigation from './app/navigations/Navigation';

YellowBox.ignoreWarnings(['Setting a timer']);

export default function App() {

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
    });
   
  }, []);

  return (
   <Navigation></Navigation>
  );
}


