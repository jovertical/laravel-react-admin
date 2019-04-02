import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LinearProgress, withStyles } from '@material-ui/core';

class LinearDeterminate extends Component {
    state = {
        completed: 0,
    };

    componentDidMount() {
        this.timer = setInterval(
            this.progress,
            this.convertSpeed(this.props.speed),
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    convertSpeed = speed => {
        switch (speed) {
            case 'verySlow':
                return 5000;
                break;

            case 'slow':
                return 2500;
                break;

            case 'moderate':
                return 1000;
                break;

            case 'fast':
                return 500;
                break;

            case 'veryFast':
                return 250;
                break;

            default:
                break;
        }
    };

    progress = () => {
        const { completed } = this.state;

        if (completed === 100) {
            this.setState({ completed: 0 });

            return;
        }

        const diff = Math.random() * 10;

        this.setState({ completed: Math.min(completed + diff, 100) });
    };

    render() {
        const { classes } = this.props;
        const { completed } = this.state;

        return (
            <div className={classes.root}>
                <LinearProgress
                    variant="determinate"
                    value={completed}
                    {...this.props}
                />
            </div>
        );
    }
}

LinearDeterminate.defaultProps = {
    speed: 'moderate',
};

LinearDeterminate.propTypes = {
    classes: PropTypes.object.isRequired,
    speed: PropTypes.oneOf([
        'verySlow',
        'slow',
        'moderate',
        'fast',
        'veryFast',
    ]),
};

const styles = {
    root: {
        flexGrow: 1,
    },
};

export default withStyles(styles)(LinearDeterminate);
