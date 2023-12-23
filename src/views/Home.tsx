import LatestUpload from '@components/LatestUpload';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import {FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import {useFetchLatestAudios} from 'src/hooks/query';

interface Props {}

const Home: FC<Props> = props => {
  const {data, isLoading} = useFetchLatestAudios();

  if (isLoading)
    return (
      <PulseAnimationContainer>
        <Text style={{color: 'white', fontSize: 25}}>Loading</Text>
      </PulseAnimationContainer>
    );

  return (
    <View style={styles.container}>
      <LatestUpload />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});

export default Home;
