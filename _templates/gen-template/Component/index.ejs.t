---
to: src/components/<%=h.changeCase.pascal(name)%>/<%=h.changeCase.pascal(name)%>.tsx
---
<%
  Name = h.changeCase.pascal(name)
-%>
import React from 'react';

export interface <%= Name %>Props {
  // props
}

const <%= Name %>: React.FC<<%= Name %>Props> = ({ /* props */ }) => {
  return <></>;
};

export default <%= Name %>;
