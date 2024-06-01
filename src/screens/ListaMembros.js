import React, {useState, useEffect} from 'react'
import {SafeAreaView, Text, FlatList, View, TouchableOpacity, Alert, Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Style from '../components/Style'
import {getAllMembersFromDb, deleteMemberFromDb} from '../components/DbMemberTable'

export default function ListScreen() {
    const [members, setMembers] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAllMembers()
        })
        return unsubscribe
    }, [navigation])

    const getAllMembers = () => {
        getAllMembersFromDb((error, result) => {
            if (error) {
                console.log('Error fetching members: ', error)
                setError('Error fetching members. Please try again later.')
            } else {
                const sortedMembers = result.sort((a, b) => a.name.localeCompare(b.name))
                setMembers(sortedMembers)
            }
        })
    }

    const handleDelete = id => {
        Alert.alert('Delete Member', 'Are you sure you want to delete this member?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: () => {
                    deleteMemberFromDb(id, error => {
                        if (error) {
                            console.log('Error deleting member: ', error)
                        } else {
                            getAllMembers()
                        }
                    })
                },
            },
        ])
    }

    const handleEdit = member => {
        navigation.navigate('Cadastro', {member})
    }

    const renderMember = ({item}) => {
        return (
            <View style={Style.memberItem}>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={Style.imageName}>
                        {item.uri ? (
                            <View style={{borderRadius: 75, borderWidth: 2}}>
                                <Image style={Style.miniAvatar} source={{uri: item.uri}} />
                            </View>
                        ) : (
                            <View style={[Style.miniAvatar, {overflow: 'hidden'}]}>
                                <Image
                                    style={{
                                        width: '85%',
                                        height: '85%',
                                        alignSelf: 'center',
                                    }}
                                    source={require('../img/user.png')}
                                />
                            </View>
                        )}
                    </View>
                    <View
                        style={{
                            flexDirection: 'column',
                            marginHorizontal: 16,
                            flexShrink: 1,
                        }}>
                        <Text style={[Style.campoText, {fontSize: 18}]}>{item.name}</Text>
                        <Text style={[Style.campoText, Style.subTextTile]}>{item.email}</Text>
                    </View>
                </View>
                <View style={Style.editDelete}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={Style.button}>
                        <Image source={require('../img/edit.png')} style={Style.buttonImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={Style.button}>
                        <Image source={require('../img/delete.png')} style={Style.buttonImage} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={Style.list}>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Text style={Style.title}>Membros</Text>
            </View>
            <FlatList
                contentContainerStyle={{flexGrow: 1}}
                data={members}
                renderItem={renderMember}
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
    )
}
