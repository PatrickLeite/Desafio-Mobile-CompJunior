import React, {useContext, useState, useEffect, useRef} from 'react'
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native'
import Style from '../components/Style'
import {AuthContext} from '../App'
import {launchImageLibrary} from 'react-native-image-picker'
import CampoTexto from '../components/CampoTexto'
import {getUserByEmail, updateUser} from '../components/DbUserTable'
import * as Yup from 'yup'

const passwordSchema = Yup.object().shape({
    password: Yup.string().required('Senha atual é obrigatória'),
    passwordNew: Yup.string()
        .required('Nova senha é obrigatória')
        .min(8, 'A nova senha deve ter pelo menos 8 caracteres')
        .max(16, 'A nova senha deve ter no máximo 16 caracteres'),
})

export default function ProfileScreen() {
    const {loggedUser, setLoggedUser} = useContext(AuthContext)
    const {setLogged} = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordNew, setPasswordNew] = useState('')
    const [selectImage, setSelectImage] = useState('')
    const [user, setUser] = useState(null)
    const newPasswordRef = useRef(null)

    useEffect(() => {
        if (loggedUser && loggedUser.email) {
            const userEmail = loggedUser.email
            setEmail(userEmail)
            getUserByEmail(userEmail, (error, user) => {
                if (error) {
                    Alert.alert('Erro', 'Erro ao carregar dados do usuário')
                    console.log(error)
                } else {
                    setUser(user)
                    setSelectImage(user.uri)
                }
            })
        }
    }, [loggedUser])

    const handleLogout = () => {
        setLogged(false)
        setLoggedUser(null)
    }

    const imagePicker = () => {
        let options = {
            storageOptions: {path: 'image'},
        }
        launchImageLibrary(options, res => {
            if (res && res.assets && res.assets.length > 0) {
                setSelectImage(res.assets[0].uri)
                console.log(res.assets[0].uri)
            } else {
                console.log('Image picking cancelled')
            }
        })
    }

    const handleSaveProfileImage = () => {
        if (user) {
            const updatedUser = {...user, uri: selectImage}
            updateUser(email, updatedUser, (error, res) => {
                if (error) {
                    Alert.alert('Erro', 'Erro ao salvar imagem do perfil')
                    console.log('Error saving profile image:', error)
                } else {
                    Alert.alert('Sucesso', 'Imagem do perfil salva com sucesso')
                }
            })
        } else {
            Alert.alert('Erro', 'Usuário não encontrado')
        }
    }

    const handlePasswordChange = async () => {
        try {
            await passwordSchema.validate({password, passwordNew})

            console.log('User:', user)
            console.log('Entered current password:', password)
            console.log('Stored password:', user.password)

            if (user && user.password === password) {
                updateUser(email, {...user, password: passwordNew}, (error, res) => {
                    if (error) {
                        Alert.alert('Erro', 'Erro ao atualizar a senha')
                        console.log('Error updating password:', error)
                    } else {
                        Alert.alert('Sucesso', 'Senha atualizada com sucesso')
                        setPassword('')
                        setPasswordNew('')
                    }
                })
            } else {
                Alert.alert('Erro', 'Senha atual incorreta')
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                Alert.alert('Erro de Validação', error.message)
            } else {
                Alert.alert('Erro', 'Ocorreu um erro inesperado')
                console.error(error)
            }
        }
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
                    <Text style={Style.title}>Perfil</Text>
                    <View style={{flexDirection: 'column'}}>
                        <TouchableOpacity onPress={() => imagePicker()} style={Style.button}>
                            {selectImage ? (
                                <Image style={Style.avatar} source={{uri: selectImage}} />
                            ) : (
                                <Image style={Style.avatar} source={require('../img/user.png')} />
                            )}
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity
                                onPress={() => handleSaveProfileImage()}
                                style={Style.button}>
                                <Image
                                    source={require('../img/confirm.png')}
                                    style={Style.buttonImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={Style.text}>Email: {email}</Text>
                    <Text style={Style.text}>Trocar senha</Text>
                    <CampoTexto
                        label="Senha Atual"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        nextFieldRef={newPasswordRef}
                    />
                    <CampoTexto
                        label="Nova Senha"
                        value={passwordNew}
                        onChangeText={setPasswordNew}
                        secureTextEntry={true}
                        ref={newPasswordRef}
                        done={true}
                    />
                    <View>
                        <TouchableOpacity onPress={handlePasswordChange}>
                            <Text style={Style.logoutText}>Atualizar senha</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={{alignItems: 'center'}}>
                            <Text style={Style.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
