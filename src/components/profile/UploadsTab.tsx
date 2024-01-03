import React, {FC, useState} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, Text} from 'react-native';
import {useFetchUploadsByProfile} from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUi from '@ui/AudioListLoadingUi';
import EmptyRecord from '@ui/EmptyRecord';
import useAudioController from 'src/hooks/useAudioController';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';
import {AudioData} from 'src/@types/audio';
import OptionsModal from '@components/OptionModal';
import colors from '@utils/colors';
import {Pressable} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import OptionSelector from '@ui/OptionSelector';

interface Props {}

const UploadsTab: FC<Props> = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {data, isLoading} = useFetchUploadsByProfile();
  const {onAudioPress} = useAudioController();
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnEditPress = () => {
    setShowOptions(false);
    if (selectedAudio)
      navigate('UpdateAudio', {
        audio: selectedAudio,
      });
  };

  if (isLoading) return <AudioListLoadingUi />;

  if (!data?.length) return <EmptyRecord title="Ở đây chưa có file nào cả!" />;

  return (
    <>
      <ScrollView style={styles.container}>
        {data?.map(item => (
          <AudioListItem
            onPress={() => onAudioPress(item, data)}
            key={item.id}
            audio={item}
            isPlaying={onGoingAudio?.id === item.id}
            onLongPress={() => handleOnLongPress(item)}
          />
        ))}
      </ScrollView>
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => {
          setShowOptions(false);
        }}
        options={[
          {
            title: 'Chỉnh sửa',
            icon: 'edit',
            onPress: handleOnEditPress,
          },
        ]}
        renderItem={item => {
          return (
            <OptionSelector
              icon={
                <AntDesign size={24} color={colors.PRIMARY} name={item.icon} />
              }
              lable={item.title}
              onPress={item.onPress}
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {color: colors.PRIMARY, fontSize: 16, marginLeft: 5},
});

export default UploadsTab;
