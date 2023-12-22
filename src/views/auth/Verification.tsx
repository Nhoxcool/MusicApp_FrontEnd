import {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import OTPField from '@ui/OTPFieild';
import AppButton from '@ui/AppButton';
interface Props {}

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = props => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const inputRef = useRef<TextInput>(null);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    if (value === 'Backspace') {
      if (!newOtp[index]) setActiveOtpIndex(index - 1);
      newOtp[index] = '';
    } else {
      setActiveOtpIndex(index + 1);
      newOtp[index] = value;
    }

    setOtp([...newOtp]);
  };

  const handlePatste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };

  const handleSubmit = () => {
    console.log(otp);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);
  return (
    <AuthFormContainer heading="Vui lòng kiểm tra email của bạn">
      <View style={styles.inputContainer}>
        {otpFields.map((_, index) => {
          return (
            <OTPField
              ref={activeOtpIndex === index ? inputRef : null}
              key={index}
              placeholder="*"
              onKeyPress={({nativeEvent}) => {
                handleChange(nativeEvent.key, index);
              }}
              onChangeText={handlePatste}
              keyboardType="numeric"
              value={otp[index] || ''}
            />
          );
        })}
      </View>
      <AppButton title="Xác nhận" onPress={handleSubmit} />
      <View style={styles.linkContainer}>
        <AppLink title="Gửi lại mã xác nhận" />
      </View>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'flex-end',
  },
});

export default Verification;
