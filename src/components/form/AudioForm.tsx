import AppView from '@components/AppView';
import CategorySelector from '@components/CategorySelector';
import FileSelector from '@components/FileSelector';
import AppButton from '@ui/AppButton';
import Progress from '@ui/Progress';
import {categories} from '@utils/categories';
import colors from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import {DocumentPickerResponse, types} from 'react-native-document-picker';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import catchAsyncError from 'src/api/catchError';
import {upldateNotification} from 'src/store/notification';
import * as yup from 'yup';

interface FromFields {
  title: string;
  category: string;
  about: string;
  file?: DocumentPickerResponse;
  poster?: DocumentPickerResponse;
}

const defaultForm: FromFields = {
  title: '',
  category: '',
  about: '',
  file: undefined,
  poster: undefined,
};

const commonSchema = {
  title: yup.string().trim().required('Tiêu đề đang thiếu!'),
  category: yup.string().oneOf(categories, 'Thể loại đang thiếu!'),
  about: yup.string().trim().required('Nội dung đang thiếu!'),
  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
};

const newAudioSchema = yup.object().shape({
  ...commonSchema,
  file: yup.object().shape({
    uri: yup.string().trim().required('File âm thanh đang thiếu!'),
    name: yup.string().trim().required('File âm thanh đang thiếu!'),
    type: yup.string().trim().required('File âm thanh đang thiếu!'),
    size: yup.number().required('File âm thanh đang thiếu!'),
  }),
});

const oldAudioSchema = yup.object().shape({
  ...commonSchema,
});

interface Props {
  initialValues?: {
    title: string;
    category: string;
    about: string;
  };
  onSubmit(formData: FormData): void;
  progress?: number;
  busy?: boolean;
}

const AudioForm: FC<Props> = ({
  initialValues,
  onSubmit,
  progress = 0,
  busy,
}) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [audioInfo, setAudioInfo] = useState({...defaultForm});
  const [isForUpdate, setIsForUpdate] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      let finalData;

      const formData = new FormData();
      if (isForUpdate) {
        finalData = await oldAudioSchema.validate(audioInfo);
      } else {
        finalData = await newAudioSchema.validate(audioInfo);
        formData.append('file', {
          name: finalData.file.name,
          type: finalData.file.type,
          uri: finalData.file.uri,
        });
      }

      formData.append('title', finalData.title);
      formData.append('about', finalData.about);
      formData.append('category', finalData.category);

      if (finalData.poster.uri)
        formData.append('poster', {
          name: finalData.poster.name,
          type: finalData.poster.type,
          uri: finalData.poster.uri,
        });

      onSubmit(formData);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
  };

  useEffect(() => {
    if (initialValues) {
      setAudioInfo({
        ...initialValues,
      });
      setIsForUpdate(true);
    }
  }, [initialValues]);

  return (
    <AppView>
      <ScrollView style={styles.container}>
        <View style={styles.fileSelctorContainer}>
          <FileSelector
            icon={
              <MaterialComIcon
                name="image-outline"
                size={35}
                color={colors.SECONDARY}
              />
            }
            btnTitle="Select Poster"
            options={{type: [types.images]}}
            onSelect={poster => {
              setAudioInfo({...audioInfo, poster});
            }}
          />
          {!isForUpdate && (
            <FileSelector
              icon={
                <MaterialComIcon
                  name="file-music-outline"
                  size={35}
                  color={colors.SECONDARY}
                />
              }
              btnTitle="Select Audio"
              style={{marginLeft: 20}}
              options={{type: [types.audio]}}
              onSelect={file => {
                setAudioInfo({...audioInfo, file});
              }}
            />
          )}
        </View>

        <View style={styles.formContainer}>
          <TextInput
            placeholderTextColor={colors.INACTIVE_CONTRAST}
            placeholder="Tiêu đề"
            style={styles.input}
            onChangeText={text => {
              setAudioInfo({...audioInfo, title: text});
            }}
            value={audioInfo.title}
          />

          <Pressable
            onPress={() => {
              setShowCategoryModal(true);
            }}
            style={styles.categorySelector}>
            <Text style={styles.categorySelectorTitle}>Thể loại</Text>
            <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
          </Pressable>

          <TextInput
            placeholderTextColor={colors.INACTIVE_CONTRAST}
            placeholder="Nội Dung"
            style={styles.input}
            numberOfLines={10}
            multiline
            onChangeText={text => {
              setAudioInfo({...audioInfo, about: text});
            }}
            value={audioInfo.about}
          />

          <CategorySelector
            visible={showCategoryModal}
            onRequestClose={() => {
              setShowCategoryModal(false);
            }}
            title="Thể loại"
            data={categories}
            renderItem={item => {
              return <Text style={styles.category}>{item}</Text>;
            }}
            onSelect={item => {
              setAudioInfo({...audioInfo, category: item});
            }}
          />

          <View style={{marginBottom: 20}} />

          {busy ? <Progress progress={progress} /> : null}

          <AppButton
            busy={busy}
            borderRadius={7}
            title={isForUpdate ? 'Thay đổi' : 'Xác nhận'}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fileSelctorContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    textAlignVertical: 'top',
  },
  category: {
    padding: 10,
    color: colors.PRIMARY,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default AudioForm;
