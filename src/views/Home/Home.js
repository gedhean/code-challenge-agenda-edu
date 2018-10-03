import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getTopMovies } from '../../api/fetch.js'
import { withStyles } from '@material-ui/core/styles'
import MovieList from '../../components/MovieList.js'

const styles = {
  root: {
    flexGrow: 1
  },
  container: {
    margin: '0px auto',
    maxWidth: '800px'
  }
}

class Home extends Component {
  state = {
    movies: [],
    page: 1,
    hasMore: true
  }

  componentDidMount() {
    this.loadMoveis(1)
  }

  loadMoveis = page => {
    console.log('page:', page)
    getTopMovies(page).then(data => {
      console.log(data)
      this.setState(prevState => ({
        movies: [...prevState.movies, ...data.results],
        page: data.page,
        totalPages: data.total_pages,
        hasMore: page < data.total_pages
      }))
    })
  }

  render() {
    const { classes } = this.props
    const { movies, hasMore } = this.state

    return (
      <div className={classes.container}>
        <MovieList movies={movies} loadMore={this.loadMoveis} hasMore={hasMore} favorite />
      </div>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)
