import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {}

const HistoryTab: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, color: 'white'}}>History</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default HistoryTab;
