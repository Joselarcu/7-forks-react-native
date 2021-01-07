import React, { useState }  from 'react';
import { StyleSheet, View} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { size, isEmpty } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import * as firebase from 'firebase';
import { validateEmail } from '../../utils/validations';
import Loading from '../Loading';


const LoginForm = (props) => {

    const { toastRef } = props;

    const initialFormState = {email: '', password: ''};

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    };

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password)) {
             toastRef.current.show('all inputs are required');
        }
        else if (!validateEmail(formData.email)) {
            toastRef.current.show('Email not valid');
        }
        else if (size(formData.password) < 6) {
            toastRef.current.show('Invalid password');
        }
        else {
            setLoading(true);
            firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
            .then(() =>{
                setLoading(false);
                navigation.navigate('account');

            })
            .catch(() =>{
                setLoading(false);
                toastRef.current.show('Email or Password Invalid');
            });
        }
    };

    return (
        <View style={styles.formContainer}>
            <Input placeholder='Email' containerStyle={styles.inputForm} onChange={(e) => onChange(e, 'email')} rightIcon={<Icon type='material-community' name='at' iconStyle={styles.iconRight} />}  />
            <Input placeholder='Password' password={'true'} secureTextEntry={!showPassword} containerStyle={styles.inputForm} onChange={(e) => onChange(e, 'password')} rightIcon={<Icon type='material-community' name={showPassword ? 'eye-off-outline' : 'eye-outline'} iconStyle={styles.iconRight} onPress={() => setShowPassword(!showPassword)} />} />
            <Button title='Login' containerStyle={styles.btnContainerLogin} buttonStyle={styles.btnLogin} onPress={onSubmit} />
            <Loading isVisible={loading} text='Login ...' />
        </View>
    );

};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    inputForm: {
        width: '100%',
        marginTop: 20
    },
    btnContainerLogin: {
        marginTop: 20,
        width: '95%'
    },
    btnLogin: {
        backgroundColor: '#00a680'
    },
    iconRight: {
        color: '#c1c1c1'
    }
});

export default LoginForm;