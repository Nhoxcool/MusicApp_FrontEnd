import AudioListLoadingUi from '@ui/AudioListLoadingUi';
import EmptyRecord from '@ui/EmptyRecord';
import colors from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import {useFetchHistory} from 'src/hooks/query';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getClient} from 'src/api/client';
import {useMutation, useQueryClient} from 'react-query';
import {History, historyAudio} from 'src/@types/audio';
import {useNavigation} from '@react-navigation/native';

interface Props {}

const HistoryTab: FC<Props> = props => {
  const {data, isLoading, isFetching} = useFetchHistory();
  const queryClient = useQueryClient();
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);
  const navigation = useNavigation();
  const noData = !data?.length;

  const removeMutate = useMutation({
    mutationFn: async histories => removeHistories(histories),
    onMutate: (histories: string[]) => {
      queryClient.setQueryData<History[]>(['histories'], oldData => {
        let newData: History[] = [];
        if (!oldData) return newData;

        for (let data of oldData) {
          const filterData = data.audios.filter(
            item => !histories.includes(item.id),
          );
          if (filterData.length) {
            newData.push({date: data.date, audios: filterData});
          }
        }
        return newData;
      });
    },
  });
  const removeHistories = async (histories: string[]) => {
    const client = await getClient();
    await client.delete('/history?histories=' + JSON.stringify(histories));
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  const handleSingleHistoryRemove = async (history: historyAudio) => {
    removeMutate.mutate([history.id]);
  };

  const handleOnLongPress = (history: historyAudio) => {
    setSelectedHistories([history.id]);
  };

  const hanldeMultipleHistoryRemove = async () => {
    setSelectedHistories([]);
    removeMutate.mutate([...selectedHistories]);
  };

  const handleOnPress = (history: historyAudio) => {
    setSelectedHistories(old => {
      if (old.includes(history.id)) {
        return old.filter(item => item !== history.id);
      }

      return [...old, history.id];
    });
  };

  const hanldeOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  useEffect(() => {
    const unSelectHistories = () => {
      setSelectedHistories([]);
    };
    navigation.addListener('blur', unSelectHistories);

    return () => {
      navigation.removeListener('blur', unSelectHistories);
    };
  }, []);

  if (isLoading) return <AudioListLoadingUi />;

  return (
    <>
      {selectedHistories.length ? (
        <Pressable
          onPress={hanldeMultipleHistoryRemove}
          style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Xóa</Text>
        </Pressable>
      ) : null}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={hanldeOnRefresh} />
        }
        style={styles.container}>
        {noData ? <EmptyRecord title="Bạn chưa có lịch sử xem!" /> : null}
        {data?.map((item, mainIndex) => {
          return (
            <View key={item.date + mainIndex}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.listContainer}>
                {item.audios.map((audio, index) => {
                  return (
                    <Pressable
                      onLongPress={() => {
                        handleOnLongPress(audio);
                      }}
                      onPress={() => {
                        handleOnPress(audio);
                      }}
                      key={audio.id + index}
                      style={[
                        styles.history,
                        {
                          backgroundColor: selectedHistories.includes(audio.id)
                            ? colors.INACTIVE_CONTRAST
                            : colors.OVERLAY,
                        },
                      ]}>
                      <Text style={styles.historiesTitle}>{audio.title}</Text>
                      <Pressable
                        onPress={() => {
                          handleSingleHistoryRemove(audio);
                        }}>
                        <AntDesign name="close" color={colors.CONTRAST} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  removeBtn: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    color: colors.CONTRAST,
  },
  listContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  date: {
    color: colors.SECONDARY,
  },
  historiesTitle: {
    color: colors.CONTRAST,
    paddingHorizontal: 5,
    fontWeight: '700',
    flex: 1,
  },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default HistoryTab;
