import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Text} from 'react-native';
import { Icon, Avatar, Input, Button, Image } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import *  as Location from 'expo-location';
import { map, size, filter } from 'lodash';
import { Alert } from 'react-native';
import MapView from "react-native-maps";
import Modal from "../../components/Account/Modal";

const widthScreen = Dimensions.get("window").width;


const AddRestaurantForm = (props) => {
    const {toastRef, setIsLoading, navigation } = props;
    const [restaurantName, setRestaurantName] = useState('')
    const [restaurantAddress, setRestaurantAddress] = useState('')
    const [restaurantDescription, setRestaurantDescription] = useState('')
    const [imagesSelected, setImagesSelected] = useState([])
    const [isMapVisible, setIsMapVisible] = useState(false)

    const addRestaurant = () => {
        console.log('OK')
        console.log('Restaurant Name:', restaurantName)
        console.log('Restaurant Adress:', restaurantAddress)
        console.log('Restaurant Description:', restaurantDescription)
        console.log('Images selected:', imagesSelected)
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant  imageRestaurant={imagesSelected[0]}/>
            <FormAdd setRestaurantName={setRestaurantName} setRestaurantAddress={setRestaurantAddress} setRestaurantDescription={setRestaurantDescription} setIsMapVisible={setIsMapVisible}/>
            <UploadImage toastRef={toastRef} imagesSelected={imagesSelected} setImagesSelected={setImagesSelected}  />
            <Button title="Create restaurant" onPress={addRestaurant} buttonStyle={styles.btnAddRestaurant} />
            <Map isMapVisible={isMapVisible} setIsMapVisible={setIsMapVisible} />
        </ScrollView>
    )
}
function FormAdd(props) {
    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsMapVisible } = props
    return (
        <View style={styles.viewForm}>
            <Input placeholder="Restaurant name" containerStyle={styles.input} onChange={e => setRestaurantName(e.nativeEvent.text)}  />
            <Input placeholder="Address" containerStyle={styles.input} onChange={e => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{ type: "material-community", name: "google-maps", color: "#c2c2c2", onPress: () => { setIsMapVisible(true)}}}/>
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
    const {isMapVisible, setIsMapVisible} = props;
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

    return (
        <Modal isVisible={isMapVisible} setIsVisible={setIsMapVisible}>
            <View>
                {location && (<MapView style={styles.mapStyle} initialRegion={location} showUserLocation={true} onRegionChange={(region) => setLocation(region)}>
                    <MapView.Marker coordinate={{latitude: location.latitude, longitude: location.longitude}} draggable ></MapView.Marker>
                </MapView>)}
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

    }

})

export default AddRestaurantForm;