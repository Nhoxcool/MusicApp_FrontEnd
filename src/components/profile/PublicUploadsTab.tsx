import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUi from '@ui/AudioListLoadingUi';
import EmptyRecord from '@ui/EmptyRecord';
import {FC} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {PublicProfileTabParamsList} from 'src/@types/navigation';
import {useFetchPublicUploads} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

type Props = NativeStackScreenProps<
  PublicProfileTabParamsList,
  'PublicUploads'
>;

const PublicUploadsTab: FC<Props> = props => {
  const {data, isLoading} = useFetchPublicUploads(props.route.params.profileId);

  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);

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
  container: {},
});

export default PublicUploadsTab;
