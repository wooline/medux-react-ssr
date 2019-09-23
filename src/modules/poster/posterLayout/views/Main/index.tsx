import {Route, Switch} from 'react-router-dom';

import Footer from '../Footer';
import Header from '../Header';
import NotFound from 'components/NotFound';
import React from 'react';
import {connect} from 'react-redux';

const posterHome = loadView('posterHome', 'Main');

interface StateProps {
  pathname: string;
}

class Component extends React.PureComponent<StateProps> {
  public render() {
    const {pathname} = this.props;
    return (
      <div className="posterLayout-Main">
        <Header />
        <Switch>
          <Route path="/poster/home" component={posterHome} />
          <Route component={NotFound} />
        </Switch>
        {pathname !== '/poster/latest-active' && <Footer />}
      </div>
    );
  }
}

const mapStateToProps: (state: RootState) => any = state => {
  return {
    pathname: state.route.location.pathname,
  };
};

export default connect(mapStateToProps)(Component);
