import React, {FC} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {useFetchUploadsByProfile} from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUi from '@ui/AudioListLoadingUi';
import EmptyRecord from '@ui/EmptyRecord';
import useAudioController from 'src/hooks/useAudioController';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {}

const UploadsTab: FC<Props> = () => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {data, isLoading} = useFetchUploadsByProfile();
  const {onAudioPress} = useAudioController();

  if (isLoading) return <AudioListLoadingUi />;

  if (!data?.length) return <EmptyRecord title="Ở đây chưa có file nào cả!" />;

  return (
    <ScrollView style={styles.container}>
      {data?.map(item => (
        <AudioListItem
          onPress={() => onAudioPress(item, data)}
          key={item.id}
          audio={item}
          isPlaying={onGoingAudio?.id === item.id}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default UploadsTab;
