import React, {FC} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {useFetchUploadsByProfile} from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUi from '@ui/AudioListLoadingUi';
import EmptyRecord from '@ui/EmptyRecord';

interface Props {}

const UploadsTab: FC<Props> = () => {
  const {data, isLoading} = useFetchUploadsByProfile();
  if (isLoading) return <AudioListLoadingUi />;

  if (!data?.length) return <EmptyRecord title="Ở đây chưa có file nào cả!" />;

  return (
    <ScrollView style={styles.container}>
      {data?.map(item => (
        <AudioListItem key={item.id} audio={item} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default UploadsTab;
