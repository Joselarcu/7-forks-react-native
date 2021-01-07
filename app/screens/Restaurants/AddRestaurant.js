import React, {useState, useRef} from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm'

const AddRestaurant = (props) => {
    const { navigation } = props
    const [isLoading, setIsLoading] = useState(false)
    const toastRef = useRef()


    return (
        <View>
            <AddRestaurantForm tastRef={toastRef} setIsLoading={setIsLoading} navigation={navigation}/>
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Creating restaurant" />
        </View>
    )
}


export default AddRestaurant;