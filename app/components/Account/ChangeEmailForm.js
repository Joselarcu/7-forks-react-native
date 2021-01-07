import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase  from 'firebase';
import { validateEmail } from '../../utils/validations';
import { reauthenticate } from '../../utils/api';

const ChangeEmailForm = (props) => {
    const { email, setShowModal, toastRef, setReloadUserInfo } = props;
    const [formData, setFormData] = useState(defaultFormValue());
    const [showPassword, setshowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text});
    }

    const onSubmit = () => {
        setErrors({});
        if( !formData.email || email === formData.email){
            setErrors({
                email: 'Email not changed'
            });
        } else if( !validateEmail(formData.email)) {
            setErrors({
                email: 'Email invalid'
            });
        } else if(!formData.password) {
            setErrors({
                password: 'Password can\'t be blank'
            })
        } else {
            setIsLoading(true);
            reauthenticate(formData.password).then(response => {
                firebase.auth().currentUser.updateEmail(formData.email).then(() => {
                    setIsLoading(false);
                    setReloadUserInfo(true);
                    toastRef.current.show('Email updated succesfully');
                    setShowModal(false);
                }).catch( () => {
                    setErrors({
                        email: 'Error updating email'
                    });
                    setIsLoading(false);
                })

            }).catch(() => {
                setIsLoading(false);
                setErrors({password: 'Password is not correct'});
            });
        }
    }

    return (
        <View style={styles.view}>
            <Input placeholder='email' containerStyle={styles.input} defaultValue={email} rightIcon={{type: 'material-community', name: 'at', color: '#c2c2c2'}} onChange={(event) => onChange(event,'email')} errorMessage={errors.email}>
            </Input>
            <Input placeholder='Password' containerStyle={styles.input} password='true' secureTextEntry={showPassword ? false : true} rightIcon={{ type: 'material-community', name: showPassword ? 'eye-off-outline' : 'eye-outline', color: '#c2c2c2', onPress: () => setshowPassword(!showPassword) }} onChange={(event) => onChange(event, 'password')} errorMessage={errors.password}></Input>
            <Button title='Modify email' containerStyle={styles.btnContainer} buttonStyle={styles.btn} onPress={onSubmit} loading={isLoading}></Button>
        </View>
    )
};

function defaultFormValue() {
    return {
        email: '',
        password: ''
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: '95%'
    },
    btn: {
        backgroundColor: '#00a680'
    }
});

export default ChangeEmailForm;