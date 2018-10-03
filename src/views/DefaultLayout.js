import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress'
import withStyles from '@material-ui/core/styles/withStyles'

// import NotFount from '../components/NotFound';
import routes from '../routes'
import firebase from '../firebase/init'
import AppBar from '../components/AppBar'
import Feedback from '../components/Feedback'
import { setFavorites } from '../store/reducers/favorites'

const styles = {
  root: {
    flexGrow: 1
  },
  main: {
    marginTop: '48px'
  }
}

class DefaultLayout extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    // Load favorites one time if user is logged
    this.unsubscribeAuthObserver = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref('favorites/' + user.uid)
          .on('value', snapshot => {
            if (snapshot.exists()) {
              console.log(`Favorites to user ${user.uid} fetched`)
              // Array of favorites movies
              const favoritesArr = Object.values(snapshot.val())
              this.props.dispatch(setFavorites(favoritesArr))
            } else {
              console.log(`O usuário ${user.uid} não possue favoritos.`)
            }
            this.setState({ loading: false })
          })
      } else {
        this.setState({ loading: false })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribeAuthObserver()
  }

  render() {
    const { classes } = this.props
    if (this.state.loading) return <LinearProgress color="secondary" />
    return (
      <Fragment>
        <div className={classes.root}>
          <AppBar />
          <main className={classes.main}>
            <Switch>
              {routes.map(
                (route, idx) =>
                  route.component ? (
                    <Route
                      key={idx}
                      exact={route.exact}
                      path={route.path}
                      name={route.name}
                      component={route.component}
                    />
                  ) : null
              )}
              <Redirect from="/" to="/home" />
            </Switch>
          </main>
        </div>
        <Feedback />
      </Fragment>
    )
  }
}

DefaultLayout.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect()(withStyles(styles)(DefaultLayout))
