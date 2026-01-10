---
to: src/components/<%=h.changeCase.pascal(name)%>/<%=h.changeCase.pascal(name)%>.tsx
---
<%
  Name = h.changeCase.pascal(name)
-%>
import React, { forwardRef, useImperativeHandle } from 'react';

export interface <%= Name %>Props {
  // props
}

export interface <%= Name %>Ref {
  // ref props
}

const <%= Name %> = forwardRef<<%= Name %>Ref, <%= Name %>Props>(({ /* props */ }, ref) => {

  useImperativeHandle(ref, () => ({
    // ref handles
  }));

  return <></>;
});

export default <%= Name %>;
