import {Route, Switch} from 'react-router-dom';

import Contact from '../Contact';
import Footer from '../Footer';
import Header from '../Header';
import NotFound from 'components/NotFound';
import React from 'react';
import {connect} from 'react-redux';

const posterHome = loadView('posterHome', 'Main');

interface StoreProps {
  pathname: string;
}

class Component extends React.PureComponent<StoreProps> {
  public render() {
    return (
      <div className="posterLayout-Main">
        <Header />
        <Switch>
          <Route path="/poster/home" component={posterHome} />
          <Route component={NotFound} />
        </Switch>
        <Contact />
        <Footer />
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
