import React, {useState, createContext} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import TabNav from './routes/TabNav'
import StackNav from './routes/StackNav'
import {dropMemberTable} from './components/DbMemberTable'
import {dropUserTable} from './components/DbUserTable'

const AuthContext = createContext()

export default App = () => {
    const [logged, setLogged] = useState(false)
    const [loggedUser, setLoggedUser] = useState(null)

    //dropMemberTable()
    //dropUserTable()

    return (
        <AuthContext.Provider value={{logged, setLogged, loggedUser, setLoggedUser}}>
            <NavigationContainer>{logged ? <TabNav /> : <StackNav />}</NavigationContainer>
        </AuthContext.Provider>
    )
}

export {AuthContext}
