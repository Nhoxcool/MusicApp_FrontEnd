import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUi from '@ui/AudioListLoadingUi';
import EmptyRecord from '@ui/EmptyRecord';
import {FC} from 'react';
import {StyleSheet, Text, ScrollView, RefreshControl} from 'react-native';
import {useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {useFetchFavorite} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {}

const FavoriteTab: FC<Props> = props => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data, isLoading, isFetching} = useFetchFavorite();
  const queryClient = useQueryClient();

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['favorite']});
  };

  if (isLoading) return <AudioListLoadingUi />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={handleOnRefresh} />
      }
      style={styles.container}>
      {!data?.length ? (
        <EmptyRecord title="Ơ đây chưa có yêu thích nào cả!" />
      ) : null}
      {data?.map(item => {
        return (
          <AudioListItem
            onPress={() => onAudioPress(item, data)}
            key={item.id}
            audio={item}
            isPlaying={onGoingAudio?.id === item.id}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default FavoriteTab;
