import React from 'react'
import TelaCadastro from '../screens/CadastroMembro'
import TelaLista from '../screens/ListaMembros'
import TelaPerfil from '../screens/Perfil'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Cores from '../components/ColorBase'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator()

export default props => (
    <Tab.Navigator
        initialRouteName="Lista"
        screenOptions={({route}) => ({
            headerShown: false,
            tabBarActiveTintColor: Cores.fundoClaro,
            tabBarInactiveTintColor: Cores.fundo,
            tabBarActiveBackgroundColor: Cores.secundaria,
            tabBarInactiveBackgroundColor: Cores.secundaria,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => {
                let iconName

                switch (route.name) {
                    case 'Cadastro':
                        iconName = focused ? 'person-add-sharp' : 'person-add-outline'
                        break
                    case 'Lista':
                        iconName = focused ? 'list-sharp' : 'list-outline'
                        break
                    case 'Perfil':
                        iconName = focused ? 'person-sharp' : 'person-outline'
                        break
                }
                return <Ionicons name={iconName} size={24} color={Cores.fundoClaro} />
            },
        })}>
        <Tab.Screen name="Cadastro" component={TelaCadastro} />
        <Tab.Screen name="Lista" component={TelaLista} />
        <Tab.Screen name="Perfil" component={TelaPerfil} />
    </Tab.Navigator>
)
