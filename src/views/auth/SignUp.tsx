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
import axios from 'axios';

const signUpSchema = yup.object({
  name: yup
    .string()
    .trim('Tên đang thiếu!')
    .min(3, 'Tên không hợp lệ!')
    .required('Vui lòng nhập tên!'),
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
  comfirmPassword: yup
    .string()
    .trim('Chưa nhập lại mật khẩu!')
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp!')
    .required('Nhập lại mật khẩu là bắt buộc!'),
});

interface Props {}

interface NewUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUp: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const [secureEntry2, setSecureEntry2] = useState(true);

  const togglePasswordView2 = () => {
    setSecureEntry2(!secureEntry2);
  };

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    try {
      const {confirmPassword, ...userData} = values;
      const response = await axios.post(
        'http://192.168.1.137:8989/auth/create',
        {
          ...userData,
        },
      );

      console.log(response);
    } catch (error) {
      console.log('Đăng nhập thất bại: ', error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signUpSchema}>
      <AuthFormContainer heading="Chào Mừng Bạn">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            placeholder="Your Name"
            label="Tên tài khoản"
            containerStyle={styles.marginBottom}
          />
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
          <AuthInputField
            name="comfirmPassword"
            placeholder="**********"
            label="Nhập lại mật khẩu"
            autoCapitalize="none"
            secureTextEntry={secureEntry2}
            containerStyle={styles.marginBottom}
            rigthIcon={<PasswordVisibilityIcon privateIcon={secureEntry2} />}
            onRightIconPress={togglePasswordView2}
          />
          <Submitbtn title="Đăng ký" />

          <View style={styles.linkContainer}>
            <AppLink
              title="Quên mật khẩu"
              onPress={() => {
                navigation.navigate('LostPassword');
              }}
            />
            <AppLink
              title="Đăng nhập"
              onPress={() => {
                navigation.navigate('SignIn');
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

export default SignUp;
