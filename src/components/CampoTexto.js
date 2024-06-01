import React from 'react'
import {View, Text, TextInput} from 'react-native'
import Style from './Style'

export default CampoTexto = React.forwardRef(
    (
        {
            keyboardType,
            placeholder,
            label,
            onChangeText,
            value,
            error,
            secureTextEntry,
            done,
            nextFieldRef,
        },
        ref,
    ) => {
        return (
            <View style={{width: '100%'}}>
                <Text style={[Style.text, {textAlign: 'center'}]}>{label}</Text>
                <TextInput
                    ref={ref}
                    style={Style.campoInput}
                    onChangeText={onChangeText}
                    value={value}
                    secureTextEntry={secureTextEntry}
                    placeholder={placeholder}
                    placeholderTextColor="#ffffff50"
                    keyboardType={keyboardType ? keyboardType : 'default'}
                    returnKeyType={done ? 'done' : 'next'}
                    onSubmitEditing={() => {
                        if (nextFieldRef && nextFieldRef.current) {
                            setTimeout(() => {
                                nextFieldRef.current.focus()
                            }, 100)
                        }
                    }}
                />
                {error ? <Text style={Style.errorText}>{error}</Text> : null}
            </View>
        )
    },
)
