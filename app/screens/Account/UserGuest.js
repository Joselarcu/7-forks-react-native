import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const UserGuest = () => {

    const navigation = useNavigation();
    

    return (
        <ScrollView centerContent='true' style={styles.viewBody}>
            <Image source={require('../../../assets/img/user-guest.jpg')} resizeMode='contain' style={styles.image} />
            <Text style={styles.title}>Check your 5 forks profile</Text>
            <Text style={styles.description}>Describe your best restaurant. Search and Display the best restaurants easily,vote and comment your experience</Text>
            <View style={styles.viewBtn}>
                <Button buttonStyle={styles.btnStyle} containerStyle={styles.btnContainer} title='Go to your profile' onPress={ () => navigation.navigate('login')} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image: {
        height:300,
        width: '100%',
        marginBottom: 40
    },
    title: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        textAlign: 'center',
        marginBottom: 20
    },
    viewBtn: {
        flex: 1,
        alignItems: 'center'
    },
    btnStyle: {
        backgroundColor: '#00a680'
    },
    btnContainer: {
        width: "70%"
    }
});

export default UserGuest;