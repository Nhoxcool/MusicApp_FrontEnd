import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import Submitbtn from '@components/form/Submitbtn';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
const LostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim('Email đang thiếu!')
    .email('Email không hợp lệ!')
    .required('Email là bắt buộc!'),
});

interface Props {}
const initialValues = {
  email: '',
};

const LostPassword: FC<Props> = props => {
  return (
    <Form
      onSubmit={values => {
        console.log(values);
      }}
      initialValues={initialValues}
      validationSchema={LostPasswordSchema}>
      <AuthFormContainer
        heading="Quên mật khẩu"
        subHeading="Bạn quên mật khẩu đừng lo lắng chúng tôi sẽ giúp bạn giải quyết!">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="test@gmail.com"
            label="Email"
            keyboardType="email-address"
            containerStyle={styles.marginBottom}
          />
          <Submitbtn title="Gửi link" />

          <View style={styles.linkContainer}>
            <AppLink title="Đăng ký" />
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

export default LostPassword;
