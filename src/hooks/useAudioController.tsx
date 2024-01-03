import deepEqual from 'deep-equal';
import {useEffect} from 'react';
import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  useProgress,
} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {
  getPlayerState,
  updateOnGoingAudio,
  updateOnGoingList,
} from 'src/store/player';

let isReady = false;

const updateQueue = async (data: AudioData[]) => {
  const lists: Track[] = data.map(item => {
    return {
      id: item.id,
      title: item.title,
      url: item.file,
      artwork: item.poster
        ? {uri: item.poster}
        : require('../assets/music.png'),
      artist: item.owner.name,
      genre: item.category,
      isLiveStream: true,
    };
  });
  await TrackPlayer.add([...lists]);
};

const useAudioController = () => {
  const playbackState = usePlaybackState();
  const {onGoingAudio, onGoingList} = useSelector(getPlayerState);
  const progress = useProgress();
  const dispatch = useDispatch();

  const isPalyerReady = playbackState !== State.None;
  const isPalying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;

  const isBusy =
    playbackState === State.Buffering || playbackState === State.Connecting;

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPalyerReady) {
      // Playing audio for the first time.
      await updateQueue(data);
      dispatch(updateOnGoingAudio(item));
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingList(data));
    }

    if (playbackState === State.Playing && onGoingAudio?.id === item.id) {
      return await TrackPlayer.pause();
    }

    if (playbackState === State.Paused && onGoingAudio?.id === item.id) {
      return await TrackPlayer.play();
    }

    if (onGoingAudio?.id !== item.id) {
      const fromSameList = deepEqual(onGoingList, data);

      await TrackPlayer.pause();
      const index = data.findIndex(audio => audio.id === item.id);
      if (!fromSameList) {
        await TrackPlayer.reset();
        await updateQueue(data);
        dispatch(updateOnGoingList(data));
      }

      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
    }
  };

  const togglePlayPause = async () => {
    if (isPalying) await TrackPlayer.pause();
    if (isPaused) await TrackPlayer.play();
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (sec: number) => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPosition + sec);
  };

  const onNextPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getCurrentTrack();
    if (currentIndex === null) return;

    const nextIndex = currentIndex + 1;

    const nextAudio = currentList[nextIndex];
    if (nextAudio) {
      await TrackPlayer.skipToNext();
      dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
    }
  };

  const onPreviousPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getCurrentTrack();

    if (currentIndex === null || currentIndex === 0) {
      return;
    }

    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0 && previousIndex < currentList.length) {
      if (progress.position != 0) {
        await TrackPlayer.skipToPrevious();
        await TrackPlayer.skipToPrevious();
        dispatch(updateOnGoingAudio(onGoingList[previousIndex]));
      } else {
        await TrackPlayer.skipToPrevious();
        dispatch(updateOnGoingAudio(onGoingList[previousIndex]));
      }
    }
  };

  const setPlaybackRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
  };

  const StopAudio = () => {
    TrackPlayer.reset();
    dispatch(updateOnGoingAudio(null));
  };

  const RepeatAudio = async () => {
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
  };

  const CancelRepeat = async () => {
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
  };

  const updateAudio = async () => {
    const currentIndex = await TrackPlayer.getCurrentTrack();
    if (currentIndex === null) return;

    dispatch(updateOnGoingAudio(onGoingList[currentIndex]));
  };

  useEffect(() => {
    const setupPlayer = async () => {
      if (isReady) return;
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 10,
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
    };

    setupPlayer();
    isReady = true;
  }, []);

  return {
    onAudioPress,
    onNextPress,
    onPreviousPress,
    seekTo,
    togglePlayPause,
    setPlaybackRate,
    skipTo,
    updateAudio,
    StopAudio,
    RepeatAudio,
    CancelRepeat,
    isBusy,
    isPalyerReady,
    isPalying,
  };
};

export default useAudioController;
