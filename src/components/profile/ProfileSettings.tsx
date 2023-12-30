import AppHeader from '@components/AppHeader';
import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from '@ui/AppButton';
import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';
import {upldateNotification} from 'src/store/notification';
import {
  updateProfile,
  updateLoggedInState,
  getAuthState,
  updateBusyInState,
} from 'src/store/auth';
import {useDispatch, useSelector} from 'react-redux';
import deepEqual from 'deep-equal';
import ImagePicker from 'react-native-image-crop-picker';
import {Keys, removeFromAsyncStorage} from '@utils/AsyncStorage';
import ReVerificationLink from '@components/ReverificationLink';
import {useQueryClient} from 'react-query';
import useAudioController from 'src/hooks/useAudioController';

interface Props {}
interface ProfileInfo {
  name: string;
  avatar?: string;
}

const ProfileSettings: FC<Props> = props => {
  const [userInfo, setUserInfo] = useState<ProfileInfo>({name: ''});
  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();
  const {StopAudio} = useAudioController();
  const {profile} = useSelector(getAuthState);
  const queryClient = useQueryClient();

  const isSame = deepEqual(userInfo, {
    name: profile?.name,
    avatar: profile?.avatar,
  });

  const handleLogout = async (fromAll?: boolean) => {
    dispatch(updateBusyInState(true));
    try {
      const endpoint = '/auth/log-out?fromAll=' + (fromAll ? 'yes' : '');
      const client = await getClient();
      await client.post(endpoint);
      await removeFromAsyncStorage(Keys.AUTH_TOKEN);
      dispatch(updateProfile(null));
      dispatch(updateLoggedInState(false));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    StopAudio();
    dispatch(updateBusyInState(false));
  };

  const handleSubmit = async () => {
    setBusy(true);
    try {
      if (!userInfo.name.trim())
        return dispatch(
          upldateNotification({
            message: 'Tên hồ sơ là bắt buộc!',
            type: 'error',
          }),
        );
      const formData = new FormData();
      formData.append('name', userInfo.name);

      if (userInfo.avatar) {
        formData.append('avatar', {
          name: 'avatar',
          type: 'image/jpeg',
          uri: userInfo.avatar,
        });
      }

      const client = await getClient({'Content-Type': 'multipart/form-data;'});
      const {data} = await client.post('/auth/update-profile', formData);
      dispatch(updateProfile(data.profile));
      dispatch(
        upldateNotification({
          message: 'Hồ sơ của bạn đã được cập nhật thành công.',
          type: 'success',
        }),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    setBusy(false);
  };

  const handleImageSelect = async () => {
    try {
      const {path} = await ImagePicker.openPicker({
        cropping: true,
        width: 300,
        height: 300,
      });

      setUserInfo({...userInfo, avatar: path});
    } catch (error) {
      console.log(error);
    }
  };

  const clearHistory = async () => {
    try {
      const client = await getClient();
      dispatch(
        upldateNotification({
          message: 'Lịch sử của bạn sẽ bị xóa!',
          type: 'success',
        }),
      );
      await client.delete('/history?all=yes');
      queryClient.invalidateQueries({queryKey: ['histories']});
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const handleOnHistoryClear = () => {
    Alert.alert(
      'Bạn có chắc muốn xóa không!',
      'Hành động này sẽ xóa hết lịch sử của bạn!',
      [
        {
          text: 'Xóa',
          style: 'destructive',
          onPress(value) {
            clearHistory();
          },
        },
        {
          text: 'Hủy bỏ',
          style: 'cancel',
          onPress(value) {
            console.log(value);
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  useEffect(() => {
    if (profile) setUserInfo({name: profile.name, avatar: profile.avatar});
  }, [profile]);

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <View style={styles.avatarContainer}>
          <AvatarField source={userInfo.avatar} />
          <Pressable onPress={handleImageSelect} style={styles.paddingLeft}>
            <Text style={styles.linkText}>Thay đổi ảnh đại diện</Text>
          </Pressable>
        </View>
        <TextInput
          onChangeText={text => setUserInfo({...userInfo, name: text})}
          style={styles.nameInput}
          value={userInfo.name}
        />
        <View style={styles.emailConainer}>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.verified ? (
            <MaterialIcon name="verified" size={15} color={colors.SECONDARY} />
          ) : (
            <ReVerificationLink linkTitle="Xác nhận" activeAtFirst />
          )}
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Lịch sử</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          onPress={handleOnHistoryClear}
          style={styles.buttonContainer}>
          <MaterialComIcon name="broom" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Xóa tất cả</Text>
        </Pressable>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Đăng Xuất</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          onPress={() => handleLogout(true)}
          style={styles.buttonContainer}>
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Đăng xuất khỏi tất cả thiết bị</Text>
        </Pressable>
        <Pressable
          onPress={() => handleLogout()}
          style={styles.buttonContainer}>
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Đăng xuất</Text>
        </Pressable>
      </View>

      {!isSame ? (
        <View style={styles.marginTop}>
          <AppButton
            onPress={handleSubmit}
            title="Xác nhận"
            borderRadius={7}
            busy={busy}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    marginTop: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.SECONDARY,
  },
  settingOptionsContainer: {
    marginTop: 15,
    paddingLeft: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.SECONDARY,
    fontStyle: 'italic',
  },
  paddingLeft: {
    paddingLeft: 15,
  },
  nameInput: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    borderWidth: 0.5,
    borderColor: colors.CONTRAST,
    borderRadius: 7,
    marginTop: 15,
  },
  emailConainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonTitle: {
    color: colors.CONTRAST,
    fontSize: 18,
    marginLeft: 5,
  },
  marginTop: {
    marginTop: 15,
  },
});

export default ProfileSettings;
