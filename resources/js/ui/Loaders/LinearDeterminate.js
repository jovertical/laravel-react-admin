import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LinearProgress, withStyles } from '@material-ui/core';

class LinearDeterminate extends Component {
    state = {
        completed: 0,
    };

    componentDidMount() {
        this.timer = setInterval(this.progress, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

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

LinearDeterminate.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = {
    root: {
        flexGrow: 1,
    },
};

export default withStyles(styles)(LinearDeterminate);
