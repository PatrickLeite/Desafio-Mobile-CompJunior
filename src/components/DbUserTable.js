import {openDatabase} from 'react-native-sqlite-storage'

const db = openDatabase({name: 'compMembers.db'})

export const dropUserTable = () => {
    db.transaction(txn => {
        txn.executeSql(
            `DROP TABLE IF EXISTS users`,
            [],
            (sqlTxn, res) => {
                console.log('Users table dropped successfully')
            },
            error => {
                console.log('Error dropping table: ', error.message)
            },
        )
    })
}

export const createTables = () => {
    db.transaction(txn => {
        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            uri TEXT DEFAULT NULL
        )`,
            [],
            (sqlTxn, res) => {
                console.log('Users created successfully')
            },
            error => {
                console.log('Error creating table: ', error.message)
            },
        )
    })
}

export const addUserToDb = (email, password, uri, callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `INSERT INTO users (email, password, uri) VALUES (?, ?, ?)`,
            [email, password, uri],
            (sqlTxn, res) => {
                console.log('Data added successfully')
                callback(null, res)
            },
            error => {
                console.log('Error adding data: ', error.message)
                callback(error.message)
            },
        )
    })
}

export const updateUser = (email, updatedUser, callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `UPDATE users SET email = ?, password = ?, uri = ? WHERE email = ?`,
            [updatedUser.email, updatedUser.password, updatedUser.uri, email],
            (sqlTxn, res) => {
                console.log('User updated successfully')
                callback(null, res)
            },
            error => {
                console.log('Error updating user:', error.message)
                callback(error.message)
            },
        )
    })
}

export const getUserByEmail = (email, callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `SELECT * FROM users WHERE email = ?`,
            [email],
            (sqlTxn, res) => {
                if (res.rows.length > 0) {
                    const user = res.rows.item(0)
                    callback(null, user)
                } else {
                    callback('User not found')
                }
            },
            error => {
                console.log('Error retrieving data: ', error.message)
                callback(error.message)
            },
        )
    })
}
