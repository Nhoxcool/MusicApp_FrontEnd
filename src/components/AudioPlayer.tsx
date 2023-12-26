import AppLink from '@ui/AppLink';
import AppModal from '@ui/AppModal';
import colors from '@utils/colors';
import formatDuration from 'format-duration';
import {FC} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useProgress} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {getPlayerState, updatePlaybackRate} from 'src/store/player';
import Slider from '@react-native-community/slider';
import useAudioController from 'src/hooks/useAudioController';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import PlayerControler from '@ui/PlayerControler';
import Loader from '@ui/Loader';
import PlayBackPlaySelector from '@ui/PlayBackRateSelector';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const formattedDuration = (duration = 0) => {
  return formatDuration(duration, {
    leading: true,
  });
};

const AudioPlayer: FC<Props> = ({visible, onRequestClose}) => {
  const {onGoingAudio, playbackRate} = useSelector(getPlayerState);
  const {
    isPalying,
    isBusy,
    onNextPress,
    onPreviousPress,
    seekTo,
    skipTo,
    togglePlayPause,
    setPlaybackRate,
  } = useAudioController();
  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');

  const {duration, position} = useProgress();
  const dispatch = useDispatch();

  const handleOnNextPress = async () => {
    await onNextPress();
  };

  const handleOnPreviousPress = async () => {
    await onPreviousPress();
  };

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: 'forward' | 'reverse') => {
    if (skipType === 'forward') await skipTo(10);
    if (skipType === 'reverse') await skipTo(-10);
  };

  const onPlayBackRatePress = async (rate: number) => {
    await setPlaybackRate(rate);
    dispatch(updatePlaybackRate(rate));
  };

  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <AppLink title={onGoingAudio?.owner.name || ''} />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {formattedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {formattedDuration(duration * 1000)}
            </Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={duration}
            maximumTrackTintColor={colors.CONTRAST}
            minimumTrackTintColor={colors.INACTIVE_CONTRAST}
            value={position}
            onSlidingComplete={updateSeek}
          />
          <View style={styles.controles}>
            {/* Nút lui lại bài trước */}
            <PlayerControler onPress={handleOnPreviousPress} ignoreContainer>
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerControler>
            {/* Nút tua lại */}
            <PlayerControler
              onPress={() => handleSkipTo('reverse')}
              ignoreContainer>
              <FontAwsome
                name="rotate-left"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>-10s</Text>
            </PlayerControler>
            {/* Nút chơi nút ngừng*/}
            <PlayerControler>
              {isBusy ? (
                <Loader color={colors.PRIMARY} />
              ) : (
                <PlayPauseBtn
                  playing={isPalying}
                  onPress={togglePlayPause}
                  color={colors.PRIMARY}
                />
              )}
            </PlayerControler>
            {/* Nút lui tới */}
            <PlayerControler
              onPress={() => handleSkipTo('forward')}
              ignoreContainer>
              <FontAwsome
                name="rotate-right"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>+10s</Text>
              {/* nút skip tới bài sau */}
            </PlayerControler>
            <PlayerControler onPress={handleOnNextPress} ignoreContainer>
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayerControler>
          </View>
          <PlayBackPlaySelector
            onPress={onPlayBackRatePress}
            activeRate={playbackRate.toString()}
            containerStyle={{marginTop: 20}}
          />
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipText: {
    fontSize: 12,
    marginTop: 2,
    color: colors.CONTRAST,
  },
});

export default AudioPlayer;