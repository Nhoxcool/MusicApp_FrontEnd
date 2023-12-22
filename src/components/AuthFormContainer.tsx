import CircleUi from '@ui/CircleUi';
import colors from '@utils/colors';
import {FC, ReactNode} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface Props {
  children: ReactNode;
  heading?: string;
  subHeading?: string;
}

const AuthFormContainer: FC<Props> = ({children, heading, subHeading}) => {
  return (
    <View style={styles.container}>
      <CircleUi position="top-left" size={200} />
      <CircleUi position="bottom-right" size={150} />
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo.png')} />
        <Text style={styles.heading}>{heading}</Text>
        {subHeading ? <Text style={styles.subHeading}>{subHeading}</Text> : ''}
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  heading: {
    color: colors.SECONDARY,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 5,
    marginLeft: 8,
  },
  subHeading: {
    color: colors.CONTRAST,
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 5,
    marginLeft: 8,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AuthFormContainer;
