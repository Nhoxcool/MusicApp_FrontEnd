import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import {FC, ReactNode} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Playlist} from 'src/@types/audio';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  list: Playlist[];
  onCreateNewPress(): void;
}

interface ListItemProps {
  title: string;
  icon: ReactNode;
  onPress?(): void;
}

const ListItem: FC<ListItemProps> = ({title, icon, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.listItemContainer}>
      {icon}
      <Text style={styles.listItemTitle}>{title}</Text>
    </Pressable>
  );
};

const PlaylistModal: FC<Props> = ({
  list,
  visible,
  onCreateNewPress,
  onRequestClose,
}) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <ScrollView>
        {list.map(item => {
          return (
            <ListItem
              key={item.id}
              icon={
                <FontAwesomeIcon
                  size={20}
                  name={item.visibility === 'public' ? 'globe' : 'lock'}
                  color={colors.PRIMARY}
                />
              }
              title={item.title}
            />
          );
        })}
      </ScrollView>
      <ListItem
        icon={<AntDesign name="plus" size={20} color={colors.PRIMARY} />}
        title="Tạo mới"
        onPress={onCreateNewPress}
      />
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {flexDirection: 'row', alignItems: 'center', height: 45},
  listItemTitle: {
    fontSize: 15,
    color: colors.PRIMARY,
    marginLeft: 5,
  },
});

export default PlaylistModal;
