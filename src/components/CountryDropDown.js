import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { List } from 'react-native-paper';

const CountryDropdown = ({ data, onSelect, placeholder }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handlePress = () => setExpanded(!expanded);

    const handleSelect = (item) => {
        setSelectedItem(item);
        setExpanded(false);
        if (onSelect) {
            onSelect(item);
        }
    };

    return (
        <View style={styles.container}>
            <List.Section>
                <List.Accordion
                    style={{ backgroundColor: '#ebedf0' }}
                    title={
                        selectedItem
                            ? `${selectedItem.flag} ${selectedItem.name} (+${selectedItem.code})`
                            : placeholder || 'Select a country'
                    }
                    expanded={expanded}
                    onPress={handlePress}
                >
                    {data.map((item) => (
                        <List.Item
                            key={item.code}
                            title={`${item.name} (+${item.code})`}
                            onPress={() => handleSelect(item)}
                            left={() => (
                                <Image
                                    source={{ uri: `https://flagcdn.com/w40/${item.flagCode.toLowerCase()}.png` }}
                                    style={styles.flagIcon}
                                />
                            )}
                        />
                    ))}
                </List.Accordion>
            </List.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        borderRadius: 18,
        overflow: 'hidden',
        height:70
    },
    flagIcon: {
        width: 24,
        height: 16,
        marginRight: 8,
        resizeMode: 'contain',
    },
});

export default CountryDropdown;
