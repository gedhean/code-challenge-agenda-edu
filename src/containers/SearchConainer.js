import React, { Component } from 'react'
import { searchMulti } from '../api/fetch.js'
import MovieList from '../components/MovieList'
import CircularLoading from '../components/CircularLoading.js'
import ResourceNotFound from '../components/ResourceNotFound.js'

class SearchConainer extends Component {
  state = {
    results: [],
    hasMore: false,
    noResults: false
  }
  componentDidMount() {
    this.loadSearch(1)
  }

  componentDidUpdate(prevProps) {
    // Check for a new search
    if (this.props.location.pathname !== prevProps.location.pathname) {
      console.log('Prev Props:', prevProps)
      console.log('New Props:', this.props)
      // reset the preview results and load new ones
      this.setState({ results: [] }, () => this.loadSearch(1))
    }
  }

  loadSearch = page => {
    const { params } = this.props.match
    const options = {
      query: params.query,
      page
    }
    searchMulti(options)
      .then(data => {
        this.setState(prevState => ({
          results: [...prevState.results, ...data.results],
          hasMore: data.page < data.total_pages,
          noResults: data.total_results === 0
        }))
        console.log(data)
      })
      .catch(err => {
        this.setState({
          error: err.message,
          noResults: this.state.results.length === 0,
          hasMore: false
        })
        console.log('Search erro:', err.message)
      })
  }

  render() {
    if (this.state.noResults) {
      return <ResourceNotFound info={this.state.error || 'No results'} />
    }

    return this.state.results.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '24px 0px' }}>
        <CircularLoading color="secondary" />
      </div>
    ) : (
      <MovieList
        movies={this.state.results}
        loadMore={this.loadSearch}
        hasMore={this.state.hasMore}
        extraInfo
        favorite
      />
    )
  }
}

export default SearchConainer
