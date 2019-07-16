import './index.less';

import {Route, Switch} from 'react-router-dom';

import Editor from '../Editor';
import {ModuleNames} from 'modules/names';
import React from 'react';
import {loadView} from '@medux/react';
import {moduleGetter} from 'modules';

const Details = loadView(moduleGetter, 'comments', 'Details');
const List = loadView(moduleGetter, 'comments', 'List');

class Component extends React.PureComponent<{}> {
  public render() {
    return (
      <div className={`${ModuleNames.comments}`}>
        <div className="wrap">
          <Switch>
            <Route exact={true} path="/:articleType/:articleId/comments" component={List} />
            <Route exact={true} path="/:articleType/:articleId/comments/:itemId" component={Details} />
          </Switch>
        </div>
        <Editor />
      </div>
    );
  }
}

export default Component;
