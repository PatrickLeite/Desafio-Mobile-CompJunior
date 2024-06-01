import React, {useEffect, useState, useRef} from 'react'
import {
    SafeAreaView,
    Text,
    Button,
    Alert,
    TouchableOpacity,
    View,
    Image,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native'
import Style from '../components/Style'
import CampoTexto from '../components/CampoTexto'
import Cores from '../components/ColorBase'
import {useNavigation} from '@react-navigation/native'
import {addMemberToDb, createTables, updateMemberInDb} from '../components/DbMemberTable'
import * as Yup from 'yup'
import {launchImageLibrary} from 'react-native-image-picker'

const memberSchema = Yup.object().shape({
    name: Yup.string().required().min(1).max(100),
    age: Yup.number().required().min(1).max(1000),
    email: Yup.string()
        .required()
        .email()
        .matches(/@compjunior\.com\.br$/),
    registrationNumber: Yup.string().required().min(9).max(9),
})

export default function RegisterScreen({route}) {
    const [selectImage, setSelectImage] = useState('')
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')
    const [registrationNumber, setRegistrationNumber] = useState('')
    const navigation = useNavigation()
    const [errors, setErrors] = useState({
        name: '',
        age: '',
        email: '',
        registrationNumber: '',
    })
    const ageRef = useRef(null)
    const emailRef = useRef(null)
    const registrationNumberRef = useRef(null)

    useEffect(() => {
        createTables()
        if (route.params && route.params.member) {
            const {member} = route.params
            setName(member.name)
            setAge(member.age.toString())
            setEmail(member.email)
            setRegistrationNumber(member.registration_number)
            setSelectImage(member.uri)
        }
    }, [route.params])

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

    const cleanFields = () => {
        setName('')
        setAge('')
        setEmail('')
        setRegistrationNumber('')
        setSelectImage('')
    }

    const handleRegisterMember = async () => {
        try {
            await memberSchema.validate({name, age, email, registrationNumber}, {abortEarly: false})

            if (route.params && route.params.member) {
                updateMemberInDb(
                    route.params.member.id,
                    name,
                    age,
                    email,
                    registrationNumber,
                    selectImage,
                    async (error, updatedMember) => {
                        if (error) {
                            Alert.alert(
                                'Erro ao atualizar membro',
                                'Ocorreu um erro ao tentar atualizar o membro',
                            )
                            console.log(error)
                        } else {
                            navigation.navigate('Lista')
                            Alert.alert('Membro atualizado com sucesso')
                            console.log(updatedMember)
                        }
                    },
                )
            } else {
                addMemberToDb(
                    name,
                    age,
                    email,
                    registrationNumber,
                    selectImage,
                    async (error, member) => {
                        if (error) {
                            Alert.alert(
                                'Erro ao cadastrar membro',
                                'Membro inválido ou já existente',
                            )
                            console.log(error)
                        } else {
                            navigation.navigate('Lista')
                            Alert.alert('Membro cadastrado com sucesso')
                            console.log(member)
                        }
                    },
                )
            }
            cleanFields()
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const newErrors = {}
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
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
                    <Text style={Style.title}>Cadastro Membros</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => imagePicker()} style={Style.button}>
                            {selectImage ? (
                                <Image style={Style.avatar} source={{uri: selectImage}} />
                            ) : (
                                <Image style={Style.avatar} source={require('../img/user.png')} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            gap: 18,
                            alignContent: 'stretch',
                            width: '100%',
                        }}>
                        <CampoTexto
                            label="Nome"
                            value={name}
                            onChangeText={text => setName(text)}
                            error={errors.name}
                            placeholder="Ex: Davi Siqueira"
                            nextFieldRef={ageRef}
                        />
                        <CampoTexto
                            label="Idade"
                            value={age}
                            onChangeText={text => setAge(text)}
                            error={errors.age}
                            placeholder="Ex: 20"
                            keyboardType="numeric"
                            ref={ageRef}
                            nextFieldRef={emailRef}
                        />
                        <CampoTexto
                            label="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                            error={errors.email}
                            placeholder="Ex: davi.siqueira@compjunior.com.br"
                            ref={emailRef}
                            nextFieldRef={registrationNumberRef}
                        />
                        <CampoTexto
                            label="Numero de Matricula"
                            value={registrationNumber}
                            onChangeText={text => setRegistrationNumber(text)}
                            error={errors.registrationNumber}
                            placeholder="Ex: 202210926"
                            keyboardType="numeric"
                            done={true}
                            ref={registrationNumberRef}
                        />
                    </View>
                    <Button
                        onPress={handleRegisterMember}
                        title="Cadastrar"
                        color={Cores.secundaria}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
