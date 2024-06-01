import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Login from '../screens/Login'
import Cadastro from '../screens/Cadastro'
import Cores from '../components/ColorBase'

const Stack = createStackNavigator()

export default props => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerTintColor: Cores.primaria,
                headerPressColor: Cores.primaria,
                headerStyle: {
                    backgroundColor: Cores.fundo,
                },
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
        </Stack.Navigator>
    )
}
