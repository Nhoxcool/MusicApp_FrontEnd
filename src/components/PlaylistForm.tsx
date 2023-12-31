import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface PlaylistInfo {
  title: string;
  private: boolean;
}

interface Props {
  visible: boolean;
  initialValue?: PlaylistInfo;
  onRequestClose(): void;
  onSubmit(value: PlaylistInfo): void;
}

const PlaylistForm: FC<Props> = ({
  visible,
  onSubmit,
  initialValue,
  onRequestClose,
}) => {
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [playlistInfo, setPlaylistInfo] = useState({
    title: '',
    private: false,
  });

  const handleSubmit = () => {
    onSubmit(playlistInfo);
    handleClose();
  };

  const handleClose = () => {
    setPlaylistInfo({title: '', private: false});
    onRequestClose();
  };

  useEffect(() => {
    if (initialValue) {
      setPlaylistInfo({...initialValue});
      setIsForUpdate(true);
    }
  }, [initialValue]);

  return (
    <BasicModalContainer visible={visible} onRequestClose={handleClose}>
      <View>
        <Text style={styles.title}>Tạo Playlist Mới</Text>
        <TextInput
          onChangeText={text => {
            setPlaylistInfo({...playlistInfo, title: text});
          }}
          placeholder="Tên Playlist"
          style={styles.input}
          value={playlistInfo.title}
        />
        <Pressable
          onPress={() => {
            setPlaylistInfo({...playlistInfo, private: !playlistInfo.private});
          }}
          style={styles.privateSelector}>
          {playlistInfo.private ? (
            <MaterialComIcon name="radiobox-marked" color={colors.PRIMARY} />
          ) : (
            <MaterialComIcon name="radiobox-blank" color={colors.PRIMARY} />
          )}
          <Text style={styles.privateLabel}>Playlist Ẩn</Text>
        </Pressable>

        <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitBtnText}>
            {isForUpdate ? 'Thay đổi' : 'Tạo'}
          </Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: colors.PRIMARY,
    fontWeight: '700',
  },
  input: {
    height: 45,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.PRIMARY,
    color: colors.PRIMARY,
  },
  privateSelector: {
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
  privateLabel: {
    color: colors.PRIMARY,
    marginLeft: 5,
  },
  submitButton: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.PRIMARY,
    borderRadius: 7,
  },
  submitBtnText: {
    color: colors.PRIMARY,
  },
});

export default PlaylistForm;
