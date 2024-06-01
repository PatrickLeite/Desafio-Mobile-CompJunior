import React, {useState, useContext, useEffect, useRef} from 'react'
import {Image, SafeAreaView, Text, Button, Alert, View} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Style from '../components/Style'
import CampoTexto from '../components/CampoTexto'
import Cores from '../components/ColorBase'
import {AuthContext} from '../App'
import * as Yup from 'yup'
import {createTables, getUserByEmail} from '../components/DbUserTable'

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required()
        .email()
        .matches(/@compjunior\.com\.br$/),
    password: Yup.string().required().min(8).max(16),
})

export default LoginScreen = () => {
    const {setLogged} = useContext(AuthContext)
    const {setLoggedUser} = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigation = useNavigation()
    const passwordRef = useRef(null)

    useEffect(() => {
        createTables()
    }, [])

    const handleEmailChange = async text => {
        setEmail(text)
        try {
            await loginSchema.validateAt('email', {email: text})
            setEmailError('')
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setEmailError('Email não pertence ao domínio @compjunior.com.br')
            }
        }
    }

    const handlePasswordChange = async text => {
        setPassword(text)
        try {
            await loginSchema.validateAt('password', {password: text})
            setPasswordError('')
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setPasswordError(error.message)
            }
        }
    }

    const handleLogin = async () => {
        try {
            await loginSchema.validate({email, password}, {abortEarly: false})

            getUserByEmail(email, async (error, user) => {
                if (error && error !== 'User not found') {
                    Alert.alert('Authentication Failed', 'An error occurred')
                    console.log(error)
                } else if (user) {
                    if (user.password === password) {
                        Alert.alert('Login Successful')
                        setLogged(true)
                        setLoggedUser({email: user.email})
                    } else {
                        Alert.alert('Login Failed', 'Invalid email or password')
                    }
                } else {
                    Alert.alert('Login Failed', 'User not found')
                }
            })
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = error.inner.reduce((acc, currentError) => {
                    acc[currentError.path] = currentError.message
                    return acc
                }, {})
                setEmailError(errors.email || '')
                setPasswordError(errors.password || '')
                Alert.alert('Validation Error', 'Please check your credentials and try again.')
            } else {
                console.error(error)
                Alert.alert('Error', 'An unexpected error occurred. Please try again.')
            }
        }
    }

    return (
        <SafeAreaView style={Style.login}>
            <Image style={Style.logo} source={require('../img/CompLogo.png')} />
            <Text style={Style.title}>CompMembros</Text>
            <Text style={Style.text}>Bem Vindo</Text>

            <CampoTexto
                placeholder="Ex: davi.siqueira@compjunior.com.br"
                label="Email"
                onChangeText={handleEmailChange}
                value={email}
                error={emailError}
                nextFieldRef={passwordRef}
            />
            <CampoTexto
                placeholder="Ex: as@g46Ly"
                label="Senha"
                onChangeText={handlePasswordChange}
                value={password}
                error={passwordError}
                secureTextEntry={true}
                done={true}
                nextFieldRef={null}
                ref={passwordRef}
            />

            <View style={{gap: 30}}>
                <Button onPress={handleLogin} title="Login" color={Cores.secundaria} />
                <View style={{gap: 5}}>
                    <Text style={Style.text}>Não possui uma conta?</Text>
                    <Button
                        onPress={() => navigation.navigate('Cadastro')}
                        title="Cadastrar"
                        color={Cores.secundaria}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}
