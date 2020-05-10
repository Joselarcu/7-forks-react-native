import React, { useState } from 'react';
import {StyleSheet, View} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { size, isEmpty } from 'lodash';
import { useNavigation} from '@react-navigation/native';
import { validateEmail } from '../../utils/validations';
import Loading  from '../Loading'; 

const RegisterForm = (props) => {
    const { toastRef } = props;

    const initialFormState = {email: '', password: '', repeatPassword: ''};

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();


    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)){
            toastRef.current.show('all inputs are required');
        }
        else if (!validateEmail(formData.email)){
            toastRef.current.show('Email not valid');
        }
        else if(formData.password !== formData.repeatPassword){
            toastRef.current.show('password must be the same');
        }
        else if(size(formData.password) < 6){
            toastRef.current.show('password must have more than 6 characters');
        }
        else {
            setLoading(true);
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).then(response => {
                console.log(response);
                setLoading(false);
                navigation.navigate('account');
            })
            .catch(err => {
                console.log('error: ', err);
                setLoading(false);
                toastRef.current.show('Email already registered');
            });
        }


    };

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text})
    };

    return(
        <View style={styles.formContainer}>
            <Input placeholder='Email' containerStyle={styles.inputForm} onChange={(e) => onChange(e, 'email')} rightIcon={<Icon type='material-community' name='at' iconStyle={styles.iconRight}  />} />
            <Input placeholder='Password' password={'true'} secureTextEntry={!showPassword} containerStyle={styles.inputForm} onChange={(e) => onChange(e, 'password')}  rightIcon={<Icon type='material-community' name={showPassword ? 'eye-off-outline' : 'eye-outline' } iconStyle={styles.iconRight} onPress={() => setShowPassword(!showPassword)} />} />
            <Input placeholder='Repeat Password' password={'true'} secureTextEntry={!showRepeatPassword} containerStyle={styles.inputForm} onChange={(e) => onChange(e, 'repeatPassword')} rightIcon={<Icon type='material-community' name={showRepeatPassword ? 'eye-off-outline' : 'eye-outline'  } iconStyle={styles.iconRight} onPress={() => setShowRepeatPassword(!showRepeatPassword)} />} />
            <Button title='Register' containerStyle={styles.btnContainerRegister} buttonStyle={styles.btnRegister} onPress={onSubmit}/>
            <Loading isVisible={loading} text='Creating account...' />
        </View>
    );
};


const styles= StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20,

    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%"
    },
    btnRegister: {
        backgroundColor: '#00a680'
    },
    iconRight: {
        color: '#c1c1c1'
    }
});

export default RegisterForm;