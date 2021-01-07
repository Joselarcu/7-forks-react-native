import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { size } from 'lodash';
import * as firebase from 'firebase';
import { reauthenticate } from '../../utils/api';

const ChangePasswordForm = (props) => {
    const {setShowModal, toastRef} = props
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (event, type) => {
        setFormData({ ...formData, [type]: event.nativeEvent.text });
    };
    const onSubmit = async () => {
        let isSetErrors = true;
        let errorsTemp = {};
        setErrors({});
        if (!formData.password || !formData.newPassword || !formData.repeatNewPassword) {
            errorsTemp = {
                password: !formData.password ? 'Password can\'t be blank' : '', newPassword: !formData.newPassword ? 'Password can\'t be blank' : '', repeatNewPassword: !formData.repeatNewPassword ? 'Password can\'t be blank' : ''
            }
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            errorsTemp = { newPassword: 'Password must be the same', repeatNewPassword: 'Password must be the same' };
        } else if(size(formData.newPassword) < 6) {
            errorsTemp = { newPassword: 'Password must have more than 5 characters', repeatNewPassword: 'Password must have more than 5 characters'};
        } else {
            setIsLoading(true);
            await reauthenticate(formData.password).then( async () => {
                await firebase.auth().currentUser.updatePassword(formData.newPassword).then( () => {
                    isSetErrors = false;
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                }).catch(() => {
                    errorsTemp = {
                        other: 'Error updating password'
                    }
                    setIsLoading(false);
                });
            }).catch( (err) => {
                errorsTemp = {
                    password: 'Password is not correct'
                }
                setIsLoading(false);
            });
        }
        
        isSetErrors && setErrors(errorsTemp);
    }

    return (
        <View style={styles.view}>
            <Input placeholder='Current Password' containerStyle={styles.input} password='true' secureTextEntry={showPassword ? false : true} rightIcon={{ type: 'material-community', name: showPassword ? 'eye-off-outline' : 'eye-outline', color: '#c2c2c2', onPress: () => setShowPassword(!showPassword) }} onChange={e => onChange(e, 'password')} errorMessage={errors.password} />

            <Input placeholder='New Password' containerStyle={styles.input} password='true' secureTextEntry={showPassword ? false : true} rightIcon={{ type: 'material-community', name: showPassword ? 'eye-off-outline' : 'eye-outline', color: '#c2c2c2', onPress: () => setShowPassword(!showPassword) }} onChange={e => onChange(e, 'newPassword')} errorMessage={errors.newPassword} />

            <Input placeholder='Repeat new Password' containerStyle={styles.input} password='true' secureTextEntry={showPassword ? false : true} rightIcon={{ type: 'material-community', name: showPassword ? 'eye-off-outline' : 'eye-outline', color: '#c2c2c2', onPress: () => setShowPassword(!showPassword) }} onChange={e => onChange(e, 'repeatNewPassword')} errorMessage={errors.repeatNewPassword} />

            <Button title='Modify Password' containerStyle={styles.btnContainer} buttonStyle={styles.btn} onPress={onSubmit} loading={isLoading} />
            <Text>{errors.other}</Text>
        </View>
    )
};

function defaultValue() {
    return { password: '', newPassword: '', repeatNewPassword: '' };
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

export default ChangePasswordForm;