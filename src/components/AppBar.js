import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Input from '@material-ui/core/Input'
import AppBar from '@material-ui/core/AppBar'
import Hidden from '@material-ui/core/Hidden'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import ButtonBase from '@material-ui/core/ButtonBase'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import HomeIcon from '@material-ui/icons/Home'
import FavoriteIcon from '@material-ui/icons/Star'
import SearchIcon from '@material-ui/icons/Search'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import { Link, withRouter } from 'react-router-dom'

import debounce from '../utils/debounce'
import firebase from '../firebase/init'
import { login, logout } from '../store/reducers/auth'
import { newFeedback } from '../store/reducers/feedback'

const styles = theme => ({
  root: {
    width: '100%'
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  },
  icon: { marginLeft: theme.spacing.unit },
  homeBtn: { padding: theme.spacing.unit }
})

// AppBar container
class SearchAppBar extends Component {
  state = {
    searchQuery: ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    // Access user data
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL
        }
        dispatch(login(userData))
        console.log('User logged:', user.displayName)
      } else {
        console.log('Não há usuário logado')
      }
    })
  }

  handleSearch = event => {
    event.persist()
    event.preventDefault()
    this.props.history.push(`/search/${this.state.searchQuery}`)
    this.setState({ searchQuery: '' })
  }

  handleChange = event => {
    this.setState({ searchQuery: event.target.value })
  }

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('Logout successful')
        this.props.dispatch(logout())
        this.props.dispatch(newFeedback({ variant: 'success', message: 'Logout success. Bye o/' }))
      })
      .catch(err => {
        console.log('Logout erro:', err)
        this.props.dispatch(
          newFeedback({ variant: 'error', message: 'Logout failed. Try again please.' })
        )
      })
  }

  render() {
    const { classes, authenticated } = this.props
    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="primary">
          <Toolbar variant="dense">
            <Hidden smUp>
              <IconButton
                to="/"
                className={classes.menuButton}
                color="inherit"
                aria-label="Open drawer"
                component={Link}
              >
                <HomeIcon />
              </IconButton>
            </Hidden>
            <ButtonBase to="/" component={Link} className={classes.homeBtn}>
              <Typography className={classes.title} variant="title" color="inherit" noWrap>
                Top Movies
              </Typography>
            </ButtonBase>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <form onSubmit={debounce(this.handleSearch, 500, true)}>
                <Input
                  onChange={this.handleChange}
                  value={this.state.searchQuery}
                  name="search"
                  autoComplete="off"
                  placeholder="Search…"
                  disableUnderline
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                  }}
                />
              </form>
            </div>

            {authenticated ? (
              <div className={classes.icon}>
                <IconButton to="/favorites" component={Link}>
                  <Tooltip title="Favorites">
                    <FavoriteIcon style={{ color: '#FFF' }} />
                  </Tooltip>
                </IconButton>
              </div>
            ) : null}
            <div>
              {authenticated ? (
                <IconButton onClick={this.handleLogout}>
                  <Tooltip title="Logout">
                    <LogoutIcon style={{ color: '#FFF' }} />
                  </Tooltip>
                </IconButton>
              ) : (
                <ButtonBase to="/login" component={Link} style={{ padding: '8px 8px 8px 16px' }}>
                  LOGIN
                </ButtonBase>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

SearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(SearchAppBar)))
