import  React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements'
import { map } from 'lodash';
import Modal from './Modal';
import ChangeDisplaNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

const AccountOptions = (props) => {
    const { userInfo, toastRef, setReloadUserInfo } = props;
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setrenderComponent] = useState(null);
    
    const selectedComponent = (key) => {
        switch(key) {
            case 'displayName':
                setrenderComponent(<ChangeDisplaNameForm displayName={userInfo.displayName} setShowModal={setShowModal} toastRef={toastRef} setReloadUserInfo={setReloadUserInfo} />);
                setShowModal(true);
                break;
            case 'email':
                setrenderComponent(<ChangeEmailForm email={userInfo.email} setShowModal={setShowModal} toastRef={toastRef} setReloadUserInfo={setReloadUserInfo} />);
                setShowModal(true);
                break;
            case 'password':
                setrenderComponent(<ChangePasswordForm setShowModal={setShowModal} toastRef={toastRef} />);
                setShowModal(true);
                break;
            default:
                setrenderComponent(null);
                setShowModal(false);
                break;
        }
    }
    
    const menuOptions = generateOptions(selectedComponent);
    
    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem key={index} title={menu.title} leftIcon={{type: menu.iconType, name: menu.iconNameLeft, color: menu.iconColorLeft}}
                    rightIcon={{ type: menu.iconType, name: menu.iconNameRight, color: menu.iconColorRight}}
                    containerStyle={styles.menuItem} onPress={menu.onPress} />
            ))}

            {renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                {renderComponent}
                </Modal>
            )}
        </View>
    )
}

function generateOptions(selectedComponent) {

    return[
        {
            title: 'Modify name and surname',
            iconType: 'material-community',
            iconNameLeft: 'account-circle',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => selectedComponent('displayName')
        },
        {
            title: 'Modify email',
            iconType: 'material-community',
            iconNameLeft: 'at',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => selectedComponent('email')
        },
        {
            title: 'Modify password',
            iconType: 'material-community',
            iconNameLeft: 'lock-reset',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => selectedComponent('password')
        }
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    }
});

export default AccountOptions;