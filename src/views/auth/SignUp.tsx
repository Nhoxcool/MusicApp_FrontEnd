import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Image, Text} from 'react-native';
import * as yup from 'yup';
import Submitbtn from '@components/form/Submitbtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import CircleUi from '@ui/CircleUi';
import AuthFormContainer from '@components/AuthFormContainer';
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
const initialValues = {
  name: '',
  email: '',
  password: '',
  comfirmPassword: '',
};

const SignUp: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const [secureEntry2, setSecureEntry2] = useState(true);

  const togglePasswordView2 = () => {
    setSecureEntry2(!secureEntry2);
  };

  return (
    <Form
      onSubmit={values => {
        console.log(values);
      }}
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
            <AppLink title="Quên mật khẩu" />
            <AppLink title="Đăng nhập" />
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
