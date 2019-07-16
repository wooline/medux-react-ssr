import './index.less';

import {Button, InputItem, Toast} from 'antd-mobile';
import {DispatchProp, connect} from 'react-redux';
import {RootState, actions} from 'modules';

import {ModuleNames} from 'modules/names';
import {RCForm} from 'entity/common';
import React from 'react';
import {UnauthorizedError} from 'common/Errors';
import {createForm} from 'rc-form';
import {errorAction} from '@medux/react-web-router';

interface Props extends DispatchProp, RCForm {
  hasLogin: boolean;
  articleType: string;
  articleId: string;
  commentId: string;
}

class Component extends React.PureComponent<Props> {
  private onSubmit = () => {
    if (!this.props.hasLogin) {
      this.props.dispatch(errorAction(new UnauthorizedError()));
    } else {
      const {
        articleType,
        articleId,
        commentId,
        form: {validateFields, getFieldError},
      } = this.props;
      validateFields<{content: string}>((errors, values) => {
        if (!errors) {
          const {content} = values;
          this.props.dispatch(actions.comments.createItem({articleType, content, articleId, commentId}));
        } else {
          const errorField = Object.keys(errors)[0];
          const message = getFieldError(errorField).join(', ');
          Toast.fail(message, 3);
        }
      });
    }
  };
  public render() {
    const {commentId} = this.props;
    const {getFieldProps} = this.props.form;
    const content = getFieldProps('content', {
      initialValue: '',
      rules: [
        {
          required: true,
          message: '请输入您想说的话！',
        },
      ],
    });
    return commentId ? (
      <div className={`${ModuleNames.comments}-Editor`}>
        <div className="input">
          <InputItem placeholder="我来说两句..." {...content} />
        </div>
        <div className="con">
          <Button type="primary" onClick={this.onSubmit}>
            {commentId ? '回复' : '评论'}
          </Button>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.comments!;
  return {
    hasLogin: state.app!.curUser!.hasLogin,
    articleType: model.routeParams!.articleType,
    articleId: model.routeParams!.articleId,
    commentId: model.routeParams!.itemId,
  };
};

export default connect(mapStateToProps)(createForm()(Component));
