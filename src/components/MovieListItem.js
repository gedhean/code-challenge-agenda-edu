import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/StarBorder'
import FavotiteCheckedIcon from '@material-ui/icons/Star'
import withStyles from '@material-ui/core/styles/withStyles'

import config from '../config'
import firebase from '../firebase/init'
import { newFeedback } from '../store/reducers/feedback'
import PreloadImage from '../components/PreloadImage.js'
import placeholderImg from '../assets/img/movie-place.png'
import MoviePopularity from '../components/MoviePopularity'
import { addFavorite, removeFavorite } from '../store/reducers/favorites'

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 345,
    position: 'relative',
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit / 2
  },
  image: { width: 133, height: 200 },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    backgroundColor: '#666',
    backgroundImage: `url(${placeholderImg})`
  },
  overview: { maxHeight: '100px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis' }
})

function MovieListItem(props) {
  const { classes, movie, extraInfo, favorite, authenticated, userId, dispatch } = props
  const movie_name = movie.title || movie.original_title || movie.originnal_name || movie.name
  const isFavorite = props.favoritesIds.includes(movie.id)

  return (
    <Paper className={classes.root} elevation={2}>
      <Grid container spacing={16} justify="center">
        <Grid item>
          <ButtonBase to={`/details/${movie.id}`} className={classes.image} component={Link}>
            <PreloadImage
              className={classes.img}
              src={`${config.api.post_base_url(1)}/${movie.poster_path}`}
              alt={movie.title}
              duration="100ms"
              lazy
            />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container justify="space-between">
          <Grid item xs container direction="column" spacing={16}>
            <Grid item xs>
              <Typography
                gutterBottom
                variant="headline"
                component="h2"
                style={{ fontSize: '1.25rem', wordBreak: 'break-word' }}
              >
                {movie_name}
              </Typography>
              {extraInfo ? (
                <Fragment>
                  <Typography
                    className={classes.overview}
                    gutterBottom
                    variant="body1"
                    component="p"
                  >
                    {movie.overview}
                  </Typography>
                  {/* <Typography color="textSecondary">
                    Release: {movie.release_date || 'Unknown'}
                  </Typography> */}
                </Fragment>
              ) : null}
            </Grid>
            <Grid item>
              <MoviePopularity popularity={movie.popularity} votes={movie.vote_average} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {favorite ? (
        <Grid item style={{position: "absolute", top: 5, right: 5}}>
          <IconButton
            onClick={() => {
              // Salvano firebase
              if (authenticated) {
                const ref = `favorites/${userId}/${movie.id}`
                if (isFavorite) {
                  firebase
                    .database()
                    .ref(ref)
                    .remove()
                    .then(res => {
                      console.log(res)
                      dispatch(removeFavorite(movie.id))
                      dispatch(
                        newFeedback({
                          variant: 'success',
                          message: `${movie_name} removed to Favorites`
                        })
                      )
                    })
                    .catch(err => {
                      console.log(err)
                      dispatch(
                        newFeedback({
                          variant: 'error',
                          message: `Faild to remove ${movie_name} to Favorites`
                        })
                      )
                    })
                } else {
                  firebase
                    .database()
                    .ref(ref)
                    .set(movie, err => {
                      if (err) {
                        dispatch(
                          newFeedback({
                            variant: 'error',
                            message: `Could not add ${movie_name} to Favorites`
                          })
                        )
                        console.log(`Could not add ${movie_name} to favorites: ${err}`)
                      } else {
                        dispatch(addFavorite(movie))
                        dispatch(
                          newFeedback({
                            variant: 'success',
                            message: `${movie_name} added to Favorites`
                          })
                        )
                        console.log(`${movie_name} added to favorites`)
                      }
                    })
                }
              } else {
                dispatch(
                  newFeedback({
                    variant: `warning`,
                    message: `Please Login in order to add ${movie_name} to favorites.`
                  })
                )
              }
            }}
          >
            <Tooltip title="Favorite" placement="top-start">
              {isFavorite ? <FavotiteCheckedIcon style={{ color: '#FFDF00' }} /> : <FavoriteIcon />}
            </Tooltip>
          </IconButton>
        </Grid>
      ) : null}
    </Paper>
  )
}

MovieListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  movie: PropTypes.object.isRequired,
  favoritesIds: PropTypes.array
}

function mapStateToProps(state) {
  return {
    userId: state.auth.userData.uid,
    authenticated: state.auth.authenticated,
    favoritesIds: state.favorites.favIds
  }
}

export default connect(mapStateToProps)(withStyles(styles)(MovieListItem))

/**
 * Movie schema
{
    "adult": false,
    "backdrop_path": "/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg",
    "genre_ids": [28,12,14,878],
    "id": 299536,
    "original_language": "en",
    "original_title": "Avengers: Infinity War",
    "overview": "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.",
    "poster_path": "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    "release_date": "2018-04-25",
    "title": "Avengers: Infinity War",
    "video": false,
    "vote_average": 8.3,
    "vote_count": 6937,
    "popularity": 358.799
}
 */
