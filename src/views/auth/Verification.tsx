import {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import OTPField from '@ui/OTPFieild';
import AppButton from '@ui/AppButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from 'src/@types/navigation';
import client from 'src/api/client';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import colors from '@utils/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = ({route}) => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [canSendNewOtpRequest, setCanSendNewOtpRequest] = useState(false);

  const {userInfo} = route.params;

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

  const isValidOtp = otp.every(value => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) return;
    setSubmitting(true);
    try {
      const {data} = await client.post('/auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });
      //Đi với phần đăng nhập
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('Lỗi ở phần xác thực!: ', error);
    }
    setSubmitting(false);
  };

  //yêu cầu gửi lại OTP
  const requestForOTP = async () => {
    setCountDown(60);
    setCanSendNewOtpRequest(false);
    try {
      await client.post('/auth/re-verify-email', {
        userId: userInfo.id,
      });
    } catch (error) {
      console.log('Yêu cầu gửi lại mã xác nhận: ', error);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (canSendNewOtpRequest) return;
    const intervalId = setInterval(() => {
      setCountDown(oldCountDown => {
        if (oldCountDown <= 0) {
          setCanSendNewOtpRequest(true);
          clearInterval(intervalId);
          return 0;
        }
        return oldCountDown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [canSendNewOtpRequest]);

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
      <AppButton busy={submitting} title="Xác nhận" onPress={handleSubmit} />
      <View style={styles.linkContainer}>
        {countDown > 0 ? (
          <Text style={styles.countDown}>{countDown} giây</Text>
        ) : null}
        <AppLink
          active={canSendNewOtpRequest}
          title="Gửi lại mã xác nhận"
          onPress={requestForOTP}
        />
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
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});

export default Verification;
