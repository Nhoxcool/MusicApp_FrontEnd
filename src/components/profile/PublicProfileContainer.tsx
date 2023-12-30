import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useMutation, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useFetchIsFollowing} from 'src/hooks/query';
import {upldateNotification} from 'src/store/notification';

interface Props {
  profile?: PublicProfile;
}

const PublicProfileContainer: FC<Props> = ({profile}) => {
  const {data: isFollowing} = useFetchIsFollowing(profile?.id || '');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const followingMutation = useMutation({
    mutationFn: async id => toggleFollowing(id),
    onMutate: (id: string) => {
      queryClient.setQueriesData<boolean>(
        ['is-following', id],
        oldData => !oldData,
      );
    },
  });

  const toggleFollowing = async (id: string) => {
    if (!id) return;

    try {
      const client = await getClient();
      await client.post('/profile/update-follower/' + id);

      queryClient.invalidateQueries({queryKey: ['profile', id]});
    } catch (error) {
      const errorMessege = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessege, type: 'error'}));
    }
  };

  if (!profile) return null;
  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />
      <View style={styles.profileInfoContainer}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.folowerText}>
          {profile.followers} Người theo dõi
        </Text>
        <Pressable
          onPress={() => followingMutation.mutate(profile.id)}
          style={styles.flexRow}>
          <Text style={styles.profileActionLink}>
            {isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoContainer: {
    paddingLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 5,
  },
  folowerText: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    marginTop: 5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PublicProfileContainer;
