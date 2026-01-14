import React from 'react';
import AppView, { AppViewProps } from '../AppView/AppView';
import AppFormInputWrapper from './components/AppFormInputWrapper/AppFormInputWrapper';
import AppFormTextInput from './components/AppFormTextInput/AppFormTextInput';

export interface AppFormProps extends AppViewProps {
  // props
}

export interface AppForm extends React.FC<AppFormProps> {
  TextInput: typeof AppFormTextInput;
  InputWrapper: typeof AppFormInputWrapper;
}

const AppForm: AppForm = Object.assign(
  (props: AppFormProps) => {
    return <AppView {...props} />;
  },
  {
    TextInput: AppFormTextInput,
    InputWrapper: AppFormInputWrapper,
  },
);

export default AppForm;
