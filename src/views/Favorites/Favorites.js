import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

import MovieList from '../../components/MovieList'

const styles = {
  root: {
    maxWidth: '800px',
    margin: '0px auto',
  }
}

class Favorites extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <MovieList
          movies={this.props.movies}
          hasMore={this.props.hasMore}
          loadMore={this.props.loadMore}
          extraInfo
          favorite={true}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Favorites)
