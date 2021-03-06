import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import ThumbIcon from '@material-ui/icons/ThumbUpAltRounded'
import SatisfiedIcon from '@material-ui/icons/SentimentSatisfiedAlt'

const styles = {
  icon: { fontSize: '20px', color: '#04C754' },
  number: { display: 'inline-bock', fontWeight: '500' },
  typo: { display: 'inline-flex', alignItems: 'center', marginRight: '12px' }
}

const MoviePopularity = ({ popularity, votes, classes, ...rest }) => {
  return (
    <div {...rest}>
      <Typography title="Popularity" color="textPrimary" className={classes.typo}>
        <SatisfiedIcon className={classes.icon} />
        &nbsp;
        <span className={classes.number}>{popularity}</span>
      </Typography>
      <Typography title="Vote average" color="textPrimary" className={classes.typo}>
        <ThumbIcon className={classes.icon} style={{ color: '#2F6ECB' }} />
        &nbsp;
        <span className={classes.number}>{votes}</span>
      </Typography>
    </div>
  )
}

MoviePopularity.propTypes = {
  popularity: PropTypes.number,
  votes: PropTypes.number
}

export default withStyles(styles)(MoviePopularity)
