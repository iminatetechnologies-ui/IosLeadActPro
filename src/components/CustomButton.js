import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const CustomButton = ({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    style = {},
    textStyle = {},
    loaderColor = '#fff'
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                style,
                (disabled || isLoading) && styles.disabledButton,
            ]}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={loaderColor} />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0389ca',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 3,
    },
    disabledButton: {
        backgroundColor: '#B0BEC5',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomButton;
