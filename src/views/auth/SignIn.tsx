import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import Submitbtn from '@components/form/Submitbtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from 'src/@types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';
const signInSchema = yup.object({
  email: yup
    .string()
    .trim('Email đang thiếu!')
    .email('Email không hợp lệ!')
    .required('Email là bắt buộc!'),
  password: yup
    .string()
    .trim('Mật khẩu đang thiếu!')
    .min(8, 'mật khẩu quá ngắn!')
    .matches(/^(?=.*[a-z])/, 'Cần ít nhất một chữ cái thường trong mật khẩu!')
    .matches(/^(?=.*[A-Z])/, 'Cần ít nhất một chữ cái in hoa trong mật khẩu!')
    .matches(/^(?=.*\d)/, 'Cần ít nhất một chữ số trong mật khẩu!')
    .matches(
      /^(?=.*[@$!%*?&])/,
      'Cần ít nhất một ký tự đặc biệt trong mật khẩu!',
    )
    .matches(
      /^[A-Za-z\d@$!%*?&]{8,}$/,
      'Mật khẩu phải có ít nhất 8 ký tự và chỉ chứa chữ cái, chữ số và ký tự đặc biệt!',
    )
    .required('Mật khẩu là bắt buộc!'),
});

interface Props {}

interface SingInUserInfo {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

const SignIn: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: SingInUserInfo,
    actions: FormikHelpers<SingInUserInfo>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/sign-in', {
        ...values,
      });
      console.log(data);
    } catch (error) {
      console.log('Đăng nhập thất bại: ', error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signInSchema}>
      <AuthFormContainer heading="Chào Mừng Bạn Trở Lại">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="test@gmail.com"
            label="Email"
            keyboardType="email-address"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="**********"
            label="Mật khẩu"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={styles.marginBottom}
            rigthIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePasswordView}
          />
          <Submitbtn title="Đăng nhập" />

          <View style={styles.linkContainer}>
            <AppLink
              title="Quên mật khẩu"
              onPress={() => {
                navigation.navigate('LostPassword');
              }}
            />
            <AppLink
              title="Chưa có tài khoản!"
              onPress={() => {
                navigation.navigate('SignUp');
              }}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 15,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SignIn;
