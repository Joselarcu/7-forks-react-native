import React, { useRef } from 'react';
import {StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import LoginForm from '../../components/Account/LoginForm';
import FacebookLogin from '../../components/Account/FacebookLogin';

const Login = () => {
    const toastRef = useRef();
    return (
        <ScrollView>
           <Image source={require('../../../assets/img/5-tenedores-letras-icono-logo.png')} resizeMode='contain' style={styles.logo} />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef} />
                <CreateAccount />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.viewContainer}>
                <FacebookLogin toastRef={toastRef} />
            </View>
            <Toast ref={toastRef} position='center' opacity={0.9} />
        </ScrollView>
    );
}

const CreateAccount = (props) => {

    const navigation = useNavigation();

    return (
        <Text style={styles.textRegister}>Not registered?{' '}
            <Text style={styles.btnRegister} onPress={() => navigation.navigate('register')}>
            Sign up
        </Text>
        </Text>
    )
}

const styles= StyleSheet.create({
    logo: {
        width: '100%',
        height: 150,
        marginTop: 20
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40
    },
    textRegister: {
        marginTop: 15,
        textAlign: 'center'
    },
    btnRegister: {
        color: '#00a680',
        fontWeight:'bold'
    },
    divider: {
        backgroundColor: '#00a680',
        margin: 40
    }
});

export default Login;