import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        left: '0',
        top: '0',
        right: '0'
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        left: '0',
        top: '0',
        right: '0',
        zIndex: '2',
        opacity: '0.5'
    },
    top: {
        zIndex: '9'
    }
}));

export default function CircularDeterminate({show}) {
    const classes = useStyles();
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        function tick() {
            // reset when reaching 100%
            setProgress((oldProgress) => (oldProgress >= 100 ? 0 : oldProgress + 1));
        }

        const timer = setInterval(tick, 20);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        show ? (
        <div className={classes.root}>
            <div className={classes.overlay}></div>
            <CircularProgress variant="determinate" value={progress} className={classes.top}/>
        </div>
        ) : (
            <React.Fragment></React.Fragment>
        )
    );
}