import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

const UserInfo = (props) => {

    const { info: { uid, photoURL, displayName, email }, toastRef, setLoading, setLoadingText } = props;

    const changeAvatar = async () => {
       const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

       if(resultPermissionCamera === 'denied') {
        toastRef.current.show('You need to grant permissions to access the galery');
       }
       else {
           const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
           });
           
           if(result.cancelled) {
               toastRef.current.show('Image galery closed');
           }
           else {
            uploadImage(result.uri).then( () => {
                updatePhotoUrl();  
            }).catch(() => {
                toastRef.current.show('Error updating avatar');
            })
           }

       }
    };

    const uploadImage = async (uri) => {
        setLoadingText('Updating avatar');
        setLoading(true);
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }

    const updatePhotoUrl = () => {
        firebase.storage().ref(`avatar/${uid}`).getDownloadURL().then( async (response) => {
            const update = {
                photoURL: response
            };
            await firebase.auth().currentUser.updateProfile(update);
            setLoading(false);
        })
        .catch(() => {
            toastRef.current.show('Error updating avatar');
        })
    }


    return(
       <View style={styles.viewUserInfo}>
            <Avatar rounded size='large' showEditButton containerStyle={styles.userInfoAvatar} source={photoURL ? { uri: photoURL } : require('../../../assets/img/avatar-default.jpg')} onEditPress={changeAvatar} />
           <View>
               <Text style={styles.displayName}>
                   { displayName ? displayName : 'Anonymous'}
               </Text>
               <Text>
                   {email ? email : 'Social login'}
               </Text>
           </View>
       </View>
    );
};

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: 'bold',
        paddingBottom: 5
    }
});

export default UserInfo;