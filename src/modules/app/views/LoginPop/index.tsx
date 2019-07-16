import './index.less';

import {Button, InputItem, List, Toast} from 'antd-mobile';
import {DispatchProp, connect} from 'react-redux';

import {LoginRequest} from 'entity/session';
import {RCForm} from 'entity/common';
import React from 'react';
import {actions} from 'modules';
import {createForm} from 'rc-form';

interface Props extends RCForm, DispatchProp {}

class Component extends React.PureComponent<Props> {
  private onSubmit = () => {
    const {validateFields, getFieldError} = this.props.form;
    validateFields((errors, values: LoginRequest) => {
      if (!errors) {
        this.props.dispatch(actions.app.login(values));
      } else {
        const errorField = Object.keys(errors)[0];
        const message = getFieldError(errorField).join(', ');
        Toast.info(message, 3);
      }
    });
  };

  public render() {
    const {
      form: {getFieldProps},
    } = this.props;

    const usernameDecorator = getFieldProps('username', {
      initialValue: '',
      rules: [
        {
          required: true,
          message: '请输入用户名！',
        },
      ],
    });
    const passwordDecorator = getFieldProps('password', {
      initialValue: '',
      rules: [
        {
          required: true,
          message: '请输入密码！',
        },
      ],
    });

    return (
      <div className="app-LoginPop">
        <List className="bd">
          <InputItem {...usernameDecorator} clear={true} placeholder="用户名" />
          <InputItem {...passwordDecorator} clear={true} placeholder="密码" type="password" />
        </List>
        <div className="ft">
          <Button type="primary" onClick={this.onSubmit}>
            登录
          </Button>
          <div className="links">
            <span>+ 注册新会员</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(createForm()(Component));
