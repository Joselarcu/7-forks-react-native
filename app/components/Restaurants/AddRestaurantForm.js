import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import { Icon, Avatar, Input, Button, Image } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import *  as Location from 'expo-location';
import { map, size, filter } from 'lodash';
import { Alert } from 'react-native';
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../../components/Account/Modal";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";

const widthScreen = Dimensions.get("window").width;


const AddRestaurantForm = (props) => {
    const {toastRef, setIsLoading, navigation } = props;
    const [restaurantName, setRestaurantName] = useState('')
    const [restaurantAddress, setRestaurantAddress] = useState('')
    const [restaurantDescription, setRestaurantDescription] = useState('')
    const [imagesSelected, setImagesSelected] = useState([])
    const [isMapVisible, setIsMapVisible] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)

    const addRestaurant = () => {
       if(!restaurantName || !restaurantDescription || !restaurantAddress){
           toastRef.current.show("All the inputs are required");
       } else if( size(imagesSelected) === 0){
           toastRef.current.show("Restaurant must have at least one picture");
       } else if (!locationRestaurant){
           toastRef.current.show("Address is required")
       } else {
           setIsLoading(true);
           uploadImageStorage().then(response => {
               setIsLoading(false);
           });
       }
    };

    const uploadImageStorage =  async () => {
        const imageBlob = [];

        await Promise.all(
            map(imagesSelected, async image => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then( async result => {
                    await firebase.storage().ref(`restaurants/${result.metadata.name}`).getDownloadURL().then(photoUrl => {
                        imageBlob.push(photoUrl);
                    })
                })
            })
        )
        return imageBlob;
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant  imageRestaurant={imagesSelected[0]}/>
            <FormAdd setRestaurantName={setRestaurantName} setRestaurantAddress={setRestaurantAddress} setRestaurantDescription={setRestaurantDescription} setIsMapVisible={setIsMapVisible} locationRestaurant={locationRestaurant}/>
            <UploadImage toastRef={toastRef} imagesSelected={imagesSelected} setImagesSelected={setImagesSelected}  />
            <Button title="Create restaurant" onPress={addRestaurant} buttonStyle={styles.btnAddRestaurant} />
            <Map isMapVisible={isMapVisible} setIsMapVisible={setIsMapVisible} setLocationRestaurant={setLocationRestaurant} toastRef={toastRef} />
        </ScrollView>
    )
}
function FormAdd(props) {
    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsMapVisible, locationRestaurant } = props
    return (
        <View style={styles.viewForm}>
            <Input placeholder="Restaurant name" containerStyle={styles.input} onChange={e => setRestaurantName(e.nativeEvent.text)}  />
            <Input placeholder="Address" containerStyle={styles.input} onChange={e => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{ type: "material-community", name: "google-maps", color: locationRestaurant ? "#00a680" : "#c2c2c2", onPress: () => { setIsMapVisible(true)}}}/>
            <Input placeholder="Restaurant Description" multiline={true} inputContainerStyle={styles.textArea} containerStyle={styles.input} onChange={e => setRestaurantDescription(e.nativeEvent.text)}/>
        </View>
    )
}

function ImageRestaurant(props) {
    const {imageRestaurant} = props
    return (
        <View style={styles.viewPhoto}>
            <Image source={ imageRestaurant ? {uri: imageRestaurant} : require("../../../assets/img/no-image.png") } style={{ width: widthScreen, height: 200}} />
        </View>
    )
}

function Map(props) {
    const { isMapVisible, setIsMapVisible, setLocationRestaurant, toastRef} = props;
    const [location, setLocation] = useState(null)

    useEffect(() => {
        ( async() => {
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
            const statusPermissions = resultPermissions.permissions.location.status;
            if(statusPermissions !== "granted"){
                toastRef.current.show("You need to accept location permissions to create a restaurant", 3000);
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.001, longitudeDelta: 0.001})
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location)
        toastRef.current.show("Location saved successfully");
        setIsMapVisible(false);
    }

    return (
        <Modal isVisible={isMapVisible} setIsVisible={setIsMapVisible}>
            <View>
                {location && (
                    <MapView 
                        style={styles.mapStyle} 
                        initialRegion={location} 
                        showUserLocation={true} 
                        onRegionChange={(region) => setLocation(region)}>
                            
                        <MapView.Marker coordinate={{latitude: location.latitude, longitude: location.longitude}} draggable ></MapView.Marker>
                    </MapView>
                    )}
                    <View style={styles.viewMapBtn}>
                    <Button title="Save location" containerStyle={styles.viewMapBtnContainerSave} buttonStyle={styles.viewMapBtnSave} onPress={confirmLocation} />
                    <Button title="Cancel"  containerStyle={styles.viewMapBtnContainerCancel} buttonStyle={styles.viewMapBtnCancel} onPress={() => setIsMapVisible(false)}/>
                    </View>
            </View>
        </Modal>
    )

}

function UploadImage(props) {
    const { toastRef, imagesSelected, setImagesSelected } = props;

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        )
        if(resultPermissions === 'denied') {
            toastRef.current.show('You need to accept galery permissions', 3000);
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            })
            if(result.cancelled) {
                toastRef.current.show('gallery closed without any image seleced', 2000)
            } else {
                setImagesSelected([...imagesSelected, result.uri])
            }
        }
    }

    const removeImage = (image) => {
       
        Alert.alert("Delete image","Are you sure you want to delete the image?",[
            {text: "Cancel", style: "cancel"},
            {text: "Delete", onPress: () => { 
                setImagesSelected(filter(imagesSelected,(imageUrl) => imageUrl !== image));
            }}
        ],
        {cancelable: false}
        )
    }

    return (
        <View style={styles.viewImage}>
            {size(imagesSelected) < 4 && (
                <Icon type="material-community" name="camera" color="#7a7a7a" containerStyle={styles.containerIcon} onPress={imageSelect} />

            )}
            {map(imagesSelected, (imageRestaurant, index) =>(
                <Avatar key={index} style={styles.miniatureStyle} source={{ uri: imageRestaurant }} onPress={() => removeImage(imageRestaurant) }/>
            ))}
        </View>
    )
}


const styles = StyleSheet.create({
    scrollView: {
        height: '100%'
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor: '#00a680',
        margin: 20
    },
    viewImage: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: '#e3e3e3'
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: 'row',
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel:  {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: '#a60d0d'
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a600"
    }

})

export default AddRestaurantForm;