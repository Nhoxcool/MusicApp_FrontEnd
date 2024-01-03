import colors from '@utils/colors';
import {FC, ReactNode} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  icon?: ReactNode;
  lable: string;
  onPress?(): void;
}

const OptionSelector: FC<Props> = ({lable, icon, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.optionContainer}>
      {icon}
      <Text style={styles.optionLabel}>{lable}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {color: colors.PRIMARY, fontSize: 16, marginLeft: 5},
});

export default OptionSelector;
