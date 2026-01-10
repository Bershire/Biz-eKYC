---
to: src/screens/<%=h.changeCase.pascal(name)%>/<%=h.changeCase.pascal(name)%>.tsx
---
<%
  Name = h.changeCase.pascal(name)
  nameCamel = h.changeCase.camel(name)
-%>
import React from 'react';
import { useTranslation } from 'react-i18next';
import AppScreen from 'src/components/AppScreen/AppScreen';
import { <%= navigatorType %>ScreenProps } from '<%= navigatorPropsImport %>';
<% if(navigator != 'ApplicationStack'){ -%>
import { ApplicationStackParamList } from 'src/navigation/navigation';
<% } -%>
import { <%= navigator %>ParamList } from '<%= navigatorImport %>';

const <%= Name %>Screen: React.FC<<%= navigatorType %>ScreenProps<<%= navigator %>ParamList<% if(navigator != 'ApplicationStack'){ -%> & ApplicationStackParamList<% } -%>, '<%= Name %>'>> = ({ route, navigation }) => {
  const { t } = useTranslation('common');

  return (
    <AppScreen header={{ title: t('screens.<%= nameCamel %>') }}>
      {/* Content here */}
    </AppScreen>
  );
};

export default <%= Name %>Screen;
