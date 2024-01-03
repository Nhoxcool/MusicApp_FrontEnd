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
  FlatList,
} from 'react-native';
import {fetchHistories, useFetchHistories} from 'src/hooks/query';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getClient} from 'src/api/client';
import {useMutation, useQueryClient} from 'react-query';
import {History, historyAudio} from 'src/@types/audio';
import {useNavigation} from '@react-navigation/native';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import PaginatedList from '@ui/PaginatedList';

interface Props {}

let pageNo = 0;
const HistoryTab: FC<Props> = props => {
  const {data, isLoading, isFetching} = useFetchHistories();
  const queryClient = useQueryClient();
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
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
    if (selectedHistories.length === 0) return;
    setSelectedHistories(old => {
      if (old.includes(history.id)) {
        return old.filter(item => item !== history.id);
      }

      return [...old, history.id];
    });
  };

  const hanldeOnEndReached = async () => {
    if (!data || !hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    pageNo += 1;
    const res = await fetchHistories(pageNo);
    if (!res || !res.length) {
      setHasMore(false);
    }
    const newData = [...data, ...res];
    const finalData: History[] = [];
    const mergeData = newData.reduce((accumulator, current) => {
      const foundObj = accumulator.find(item => item.date === current.date);
      if (foundObj) {
        foundObj.audios = foundObj.audios.concat(current.audios);
      } else {
        accumulator.push(current);
      }
      return accumulator;
    }, finalData);

    queryClient.setQueryData(['histories'], mergeData);
    setIsFetchingMore(false);
  };

  const hanldeOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
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

      <PaginatedList
        data={data}
        onEndReached={hanldeOnEndReached}
        renderItem={({item}) => {
          return (
            <View key={item.date}>
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
        }}
        ListEmptyComponent={<EmptyRecord title="Bạn chưa có lịch sử xem!" />}
        refreshing={isFetching}
        onRefresh={hanldeOnRefresh}
        isFetching={isFetchingMore}
        hasMore={hasMore}
      />
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
