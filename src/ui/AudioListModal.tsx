import colors from '@utils/colors';
import {FC} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import AppModal from './AppModal';
import {AudioData} from 'src/@types/audio';
import AudioListItem from './AudioListItem';
import AudioListLoadingUi from './AudioListLoadingUi';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {
  data: AudioData[];
  header?: string;
  visible: boolean;
  onRequestClose(): void;
  onItemPress(item: AudioData, data: AudioData[]): void;
  loading?: boolean;
  isPlaying?: boolean;
}

const AudioListModal: FC<Props> = ({
  header,
  data,
  loading,
  visible,
  onRequestClose,
  onItemPress,
}) => {
  const {onGoingAudio} = useSelector(getPlayerState);
  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        {loading ? (
          <AudioListLoadingUi />
        ) : (
          <>
            <Text style={styles.header}>{header}</Text>
            <FlatList
              contentContainerStyle={styles.flatlist}
              data={data}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <AudioListItem
                    onPress={() => onItemPress(item, data)}
                    audio={item}
                    isPlaying={onGoingAudio?.id === item.id}
                  />
                );
              }}
            />
          </>
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  flatlist: {
    paddingBottom: 50,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.CONTRAST,
    paddingVertical: 10,
  },
});

export default AudioListModal;
