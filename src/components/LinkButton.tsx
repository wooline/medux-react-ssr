import * as React from 'react';

import {AnchorHTMLAttributes} from 'react';
import {Button} from 'antd-mobile';
import {linkTo} from 'common/route';
import {reference} from 'common/utils';

reference(Button);

const Component = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const {onClick, ...others} = props;
  return (
    <a
      {...others}
      onClick={e => {
        if (onClick) {
          onClick(e);
        }
        linkTo(e);
      }}
      role="button"
    >
      {props.children}
    </a>
  );
};
export default Component;
