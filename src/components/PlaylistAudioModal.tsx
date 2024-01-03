import AppModal from '@ui/AppModal';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUi from '@ui/AudioListLoadingUi';
import EmptyRecord from '@ui/EmptyRecord';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {
  Animated,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {QueryClient, useMutation, useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {AudioData, CompletePlaylist} from 'src/@types/audio';
import client, {getClient} from 'src/api/client';
import {useFetchPlaylistAudios} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';
import {
  getPlaylistModalState,
  updatePlaylistVisibility,
} from 'src/store/playlistModal';

interface Props {}

const removeAudioFromPlaylist = async (id: string, playlistId: string) => {
  const client = await getClient();
  await client.delete(`/playlist?playlistId=${playlistId}&resId=${id}`);
};

const PlaylistAudioModal: FC<Props> = props => {
  const {visible, selectedListId, isPrivate, allowPlaylistAudioRemove} =
    useSelector(getPlaylistModalState);
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const dispatch = useDispatch();
  const {data, isLoading} = useFetchPlaylistAudios(
    selectedListId || '',
    isPrivate || false,
  );

  const queryClient = useQueryClient();
  const [removing, setRemoving] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async ({id, playlistId}) =>
      removeAudioFromPlaylist(id, playlistId),
    onMutate: (variable: {id: string; playlistId: string}) => {
      queryClient.setQueryData<CompletePlaylist>(
        ['playlist-audios', selectedListId],
        oldData => {
          let finalData: CompletePlaylist = {title: '', id: '', audios: []};

          if (!oldData) return finalData;

          const audios = oldData?.audios.filter(
            item => item.id !== variable.id,
          );

          return {...oldData, audios};
        },
      );
    },
  });

  const handleClose = () => {
    dispatch(updatePlaylistVisibility(false));
  };

  const renderRightAction = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.swipealbeContainer}>
        <Animated.View style={{transform: [{scale}]}}>
          <Text style={{color: colors.CONTRAST}}>
            {removing ? 'Đang xóa...' : 'Xóa'}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const renderItem: ListRenderItem<AudioData> = ({item}) => {
    if (allowPlaylistAudioRemove)
      return (
        <Swipeable
          onSwipeableOpen={() => {
            deleteMutation.mutate({
              id: item.id,
              playlistId: selectedListId || '',
            });
            setRemoving(false);
          }}
          onSwipeableWillOpen={() => {
            setRemoving(true);
          }}
          renderRightActions={renderRightAction}>
          <RectButton onPress={() => onAudioPress(item, data?.audios || [])}>
            <AudioListItem
              audio={item}
              isPlaying={onGoingAudio?.id === item.id}
            />
          </RectButton>
        </Swipeable>
      );
    else
      return (
        <AudioListItem
          audio={item}
          isPlaying={onGoingAudio?.id === item.id}
          onPress={() => onAudioPress(item, data?.audios || [])}
        />
      );
  };

  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      <View style={styles.container}>
        {isLoading ? (
          <AudioListLoadingUi />
        ) : (
          <>
            <Text style={styles.title}>{data?.title}</Text>
            <FlatList
              contentContainerStyle={styles.flatlist}
              data={data?.audios}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListEmptyComponent={
                <EmptyRecord title="Không có file Audio nào cả" />
              }
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
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
  },
  swipealbeContainer: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default PlaylistAudioModal;
