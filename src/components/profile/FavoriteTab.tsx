import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUi from '@ui/AudioListLoadingUi';
import EmptyRecord from '@ui/EmptyRecord';
import {FC} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFetchFavorite} from 'src/hooks/query';

interface Props {}

const FavoriteTab: FC<Props> = props => {
  const {data, isLoading} = useFetchFavorite();
  if (isLoading) return <AudioListLoadingUi />;

  if (!data?.length)
    return <EmptyRecord title="Ở đây chưa có yêu thích nào cả!" />;

  return (
    <ScrollView style={styles.container}>
      {data?.map(item => (
        <AudioListItem key={item.id} audio={item} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default FavoriteTab;
