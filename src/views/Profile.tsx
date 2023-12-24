import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PlaylistTab from '@components/profile/PlaylistTab';
import FavoriteTab from '@components/profile/FavoriteTab';
import HistoryTab from '@components/profile/HistoryTab';
import colors from '@utils/colors';
import UploadsTab from '@components/profile/UploadsTab';
import ProfileContainer from '@components/ProfileContainer';
import {useSelector} from 'react-redux';
import {getAuthState} from 'src/store/auth';

const Tab = createMaterialTopTabNavigator();

interface Props {}

const Profile: FC<Props> = props => {
  const {profile} = useSelector(getAuthState);
  return (
    <View style={styles.container}>
      <ProfileContainer profile={profile} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
        }}>
        <Tab.Screen name="File đã đăng" component={UploadsTab} />
        <Tab.Screen name="Playlist của bạn" component={PlaylistTab} />
        <Tab.Screen name="Yêu Thích" component={FavoriteTab} />
        <Tab.Screen name="Lịch Sử" component={HistoryTab} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabBarStyle: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
  },
  tabBarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
  },
});

export default Profile;
