import React, {useState, useContext, useEffect, useRef} from 'react'
import {
    Image,
    SafeAreaView,
    Text,
    Button,
    Alert,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native'
import {launchImageLibrary} from 'react-native-image-picker'
import Style from '../components/Style'
import CampoTexto from '../components/CampoTexto'
import Cores from '../components/ColorBase'
import {AuthContext} from '../App'
import * as Yup from 'yup'
import {createTables, getUserByEmail, addUserToDb} from '../components/DbUserTable'

const registerSchema = Yup.object().shape({
    email: Yup.string()
        .required()
        .email()
        .matches(/@compjunior\.com\.br$/),
    password: Yup.string().required().min(8).max(16),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas não são iguais')
        .required()
        .min(8)
        .max(16),
})

export default RegisterScreen = () => {
    const [selectImage, setSelectImage] = useState('')
    const {setLogged} = useContext(AuthContext)
    const {setLoggedUser} = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    useEffect(() => {
        createTables()
    }, [])

    const handleEmailChange = async text => {
        setEmail(text)
        try {
            await registerSchema.validateAt('email', {email: text})
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
            await registerSchema.validateAt('password', {password: text})
            setPasswordError('')
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setPasswordError(error.message)
            }
        }
    }

    const bothPasswordsAreSame = text => {
        setConfirmPassword(text)
        if (password !== text) {
            setPasswordError('As senhas não são iguais')
        } else {
            setPasswordError('')
        }
    }

    const handleRegister = async () => {
        try {
            await registerSchema.validate({email, password, confirmPassword}, {abortEarly: false})

            getUserByEmail(email, async (error, user) => {
                if (error && error !== 'User not found') {
                    Alert.alert('Authentication Failed', 'An error occurred')
                    console.log(error)
                } else if (user) {
                    Alert.alert('Registration Failed', 'User already exists')
                } else {
                    addUserToDb(email, password, selectImage, (error, res) => {
                        if (error) {
                            Alert.alert(
                                'Registration Failed',
                                'An error occurred while creating user',
                            )
                            console.log(error)
                        } else {
                            Alert.alert('Registration Successful')
                            setLogged(true)
                            setLoggedUser({email: email})
                        }
                    })
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

    const imagePicker = () => {
        let options = {
            storageOptions: {path: 'image'},
        }
        launchImageLibrary(options, res => {
            if (res && res.assets && res.assets.length > 0) {
                setSelectImage(res.assets[0].uri)
            } else {
                console.log('Image picking cancelled')
            }
        })
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.select({ios: 0, android: 40})}>
                <ScrollView
                    contentContainerStyle={Style.login}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <Image style={Style.logo} source={require('../img/CompLogo.png')} />
                    <Text style={Style.title}>CompMembros</Text>
                    <Text style={Style.text}>Bem Vindo</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => imagePicker()} style={Style.button}>
                            {selectImage ? (
                                <Image style={Style.miniAvatar} source={{uri: selectImage}} />
                            ) : (
                                <Image
                                    style={Style.miniAvatar}
                                    source={require('../img/user.png')}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    <CampoTexto
                        label="Email"
                        placeholder="Ex: davi.siqueira@compjunior.com.br"
                        onChangeText={handleEmailChange}
                        value={email}
                        error={emailError}
                        nextFieldRef={passwordRef}
                    />
                    <CampoTexto
                        label="Senha"
                        placeholder="Ex: as@g46Ly"
                        onChangeText={handlePasswordChange}
                        value={password}
                        error={passwordError}
                        secureTextEntry={true}
                        ref={passwordRef}
                        nextFieldRef={confirmPasswordRef}
                    />
                    <CampoTexto
                        label="Confirmar Senha"
                        placeholder="Ex: as@g46Ly"
                        onChangeText={bothPasswordsAreSame}
                        value={confirmPassword}
                        error={passwordError}
                        secureTextEntry={true}
                        ref={confirmPasswordRef}
                        done={true}
                    />
                    <Button onPress={handleRegister} title="Cadastro" color={Cores.secundaria} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
