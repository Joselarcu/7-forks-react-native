import React from 'react';
import { View, Text, Button } from 'react-native';
import * as firebase from 'firebase';

const UserLogged = () => {

    return (
        <View>
            <Text>UserLogged ....</Text>
            <Button onPress={() => firebase.auth().signOut()} title='Finish session' />
        </View>
    );
};

export default UserLogged;