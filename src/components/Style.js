import {StyleSheet} from 'react-native'
import Cores from '../components/ColorBase'

export default StyleSheet.create({
    login: {
        backgroundColor: Cores.primaria,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 30,
        flexDirection: 'column',
    },
    list: {
        backgroundColor: Cores.primaria,
        flexGrow: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: 40,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignContent: 'stretch',
        padding: 20,
    },
    title: {
        fontSize: 40,
        color: Cores.branco,
        borderRadius: 10,
    },
    text: {
        fontSize: 20,
        color: Cores.branco,
        borderRadius: 10,
    },
    campoText: {
        fontSize: 20,
        color: Cores.branco,
        borderRadius: 10,
        flex: 1,
    },
    subTextTile: {
        fontSize: 14,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    campoInput: {
        width: '100%',
        color: Cores.branco,
        backgroundColor: Cores.fundo,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 16,
    },
    loginCadastro: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editDelete: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    memberItem: {
        padding: 14,
        borderWidth: 1,
        borderColor: Cores.branco,
        backgroundColor: Cores.secundaria,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    button: {
        paddingHorizontal: 3,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        backgroundColor: Cores.branco,
    },
    miniAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Cores.branco,
        alignContent: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    logoutText: {
        backgroundColor: Cores.secundaria,
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        color: Cores.branco,
        fontSize: 20,
    },
    imageName: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
