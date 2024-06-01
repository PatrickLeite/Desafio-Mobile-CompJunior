import {openDatabase} from 'react-native-sqlite-storage'

const db = openDatabase({name: 'compMembers.db'})

export const dropMemberTable = () => {
    db.transaction(txn => {
        txn.executeSql(
            `DROP TABLE IF EXISTS members`,
            [],
            (sqlTxn, res) => {
                console.log('Members table dropped successfully')
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
            `CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                email TEXT NOT NULL UNIQUE,
                registration_number TEXT NOT NULL UNIQUE,
                uri TEXT DEFAULT NULL
            )`,
            [],
            (sqlTxn, res) => {
                console.log('Members created successfully')
            },
            error => {
                console.log('Error creating table: ', error.message)
            },
        )
    })
}

export const getAllMembersFromDb = callback => {
    db.transaction(txn => {
        txn.executeSql(
            `SELECT * FROM members`,
            [],
            (sqlTxn, res) => {
                const members = []
                for (let i = 0; i < res.rows.length; i++) {
                    members.push(res.rows.item(i))
                }
                callback(null, members)
            },
            error => {
                console.log('Error retrieving members: ', error.message)
                callback(error.message)
            },
        )
    })
}

export const updateMemberInDb = (id, name, age, email, registrationNumber, uri, callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `UPDATE members SET name = ?, age = ?, email = ?, registration_number = ?, uri = ? WHERE id = ?`,
            [name, age, email, registrationNumber, uri, id],
            (sqlTxn, res) => {
                console.log('Member updated successfully')
                callback(null, res)
            },
            error => {
                console.log('Error updating member: ', error.message)
                callback(error.message)
            },
        )
    })
}

export const addMemberToDb = (name, age, email, registrationNumber, uri, callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `INSERT INTO members (name, age, email, registration_number, uri) VALUES (?, ?, ?, ?, ?)`,
            [name, age, email, registrationNumber, uri],
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

export const getMemberByEmail = (email, callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `SELECT * FROM members WHERE email = ?`,
            [email],
            (sqlTxn, res) => {
                if (res.rows.length > 0) {
                    const member = res.rows.item(0)
                    callback(null, member)
                } else {
                    callback('Member not found')
                }
            },
            error => {
                console.log('Error retrieving data: ', error.message)
                callback(error.message)
            },
        )
    })
}

export const deleteMemberFromDb = (id, callback) => {
    db.transaction(txn => {
        txn.executeSql(
            `DELETE FROM members WHERE id = ?`,
            [id],
            (sqlTxn, res) => {
                console.log('Member deleted successfully')
                callback(null, res)
            },
            error => {
                console.log('Error deleting member: ', error.message)
                callback(error.message)
            },
        )
    })
}
