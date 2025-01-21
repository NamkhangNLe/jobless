import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const activity = () => {
    const { activity } = useLocalSearchParams();

    return (
        <View>
        <Text>{activity} search</Text>
        </View>
    );
}

export default activity;