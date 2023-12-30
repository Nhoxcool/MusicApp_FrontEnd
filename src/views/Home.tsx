import AppView from '@components/AppView';
import LatestUpload from '@components/LatestUpload';
import OptionsModal from '@components/OptionModal';
import PlaylistForm, {PlaylistInfo} from '@components/PlaylistForm';
import PlayListModal from '@components/PlaylistModal';
import RecentlyPlayed from '@components/RecentlyPlayed';
import RecommendedAudios from '@components/RecommendedAudios';
import RecommendedPlaylist from '@components/RecommendedPlaylist';
import {Keys, getFromAsyncStorage} from '@utils/AsyncStorage';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {StyleSheet, Pressable, Text, ScrollView, View} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {AudioData, Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useFetchPlaylist} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getAuthState} from 'src/store/auth';
import {upldateNotification} from 'src/store/notification';
import {
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModal';

interface Props {
  onListPress(playlist: Playlist): void;
}

const Home: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const {onAudioPress} = useAudioController();
  const {loggedIn} = useSelector(getAuthState);

  const {data} = useFetchPlaylist();

  const dispatch = useDispatch();

  const handleOnFavPress = async () => {
    if (!selectedAudio) return;

    try {
      const client = await getClient();

      const {data} = await client.post('/favorite?audioId=' + selectedAudio.id);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }

    setSelectedAudio(undefined);
    setShowOptions(false);
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistModal(true);
  };

  const handlePlaylistSubmit = async (value: PlaylistInfo) => {
    if (!value.title.trim()) return;

    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      const client = await getClient();
      const {data} = await client.post('/playlist/create', {
        resId: selectedAudio?.id,
        title: value.title,
        visibility: value.private ? 'private' : 'public',
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      console.log(errorMessage);
    }
  };

  const updatePlaylist = async (item: Playlist) => {
    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      const client = await getClient();
      const {data} = await client.patch('/playlist', {
        id: item.id,
        item: selectedAudio?.id,
        title: item.title,
        visibility: item.visibility,
      });

      setSelectedAudio(undefined);
      setShowPlaylistModal(false);
      dispatch(
        upldateNotification({
          message: 'File đã được upload thành công!',
          type: 'success',
        }),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      console.log(errorMessage);
    }
  };

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.space}>
          <RecentlyPlayed />
        </View>

        <View style={styles.space}>
          <LatestUpload
            onAudioPress={onAudioPress}
            onAudioLongPress={handleOnLongPress}
          />
        </View>

        <View style={styles.space}>
          <RecommendedAudios
            onAudioPress={onAudioPress}
            onAudioLongPress={handleOnLongPress}
          />
        </View>

        <View style={styles.space}>
          <RecommendedPlaylist onListPress={handleOnListPress} />
        </View>

        <OptionsModal
          visible={showOptions}
          onRequestClose={() => {
            setShowOptions(false);
          }}
          options={[
            {
              title: 'Add to playlist',
              icon: 'playlist-music',
              onPress: handleOnAddToPlaylist,
            },
            {
              title: 'Add to favorite',
              icon: 'cards-heart',
              onPress: handleOnFavPress,
            },
          ]}
          renderItem={item => {
            return (
              <Pressable onPress={item.onPress} style={styles.optionContainer}>
                <MaterialComIcon
                  size={24}
                  color={colors.PRIMARY}
                  name={item.icon}
                />
                <Text style={styles.optionLabel}>{item.title}</Text>
              </Pressable>
            );
          }}
        />
        <PlayListModal
          visible={showPlaylistModal}
          onRequestClose={() => {
            setShowPlaylistModal(false);
          }}
          list={data || []}
          onCreateNewPress={() => {
            setShowPlaylistModal(false);
            setShowPlaylistForm(true);
          }}
          onPlaylistPress={updatePlaylist}
        />

        <PlaylistForm
          visible={showPlaylistForm}
          onRequestClose={() => {
            setShowPlaylistForm(false);
          }}
          onSubmit={handlePlaylistSubmit}
        />
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  space: {
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {color: colors.PRIMARY, fontSize: 16, marginLeft: 5},
});

export default Home;
