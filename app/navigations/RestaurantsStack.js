import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Restaurants from '../screens/Restaurants/Restaurants';
import AddRestaurant from '../screens/Restaurants/AddRestaurant';


const Stack = createStackNavigator();

const RestaurantsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="restaurants" component={Restaurants} options={{ title: 'Restaurants' }}></Stack.Screen>
            <Stack.Screen name="add-restaurant" component={AddRestaurant} options={{ title: 'Add new restaurant' }}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default RestaurantsStack;