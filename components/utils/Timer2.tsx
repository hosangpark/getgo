import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableNativeFeedback, TouchableOpacity, Alert } from 'react-native';
// import PropTypes from 'prop-types';
import { colors } from '../../assets/color';
import style from '../../assets/style/style';


function formatTimeString(time, showMsecs) {
    let msecs = String(time % 1000);
    let me = msecs.substr(0, 2)
    if (msecs < 10) {
        me = `${me}0`;
    } else if (msecs < 100) {
        me = `${me}`;
    }

    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(time / 60000);
    let hours = Math.floor(time / 3600000);
    seconds = seconds - minutes * 60;
    minutes = minutes - hours * 60;
    let formatted;
    formatted = `${
        minutes < 10 ? 0 : ""
        }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;

    // if (!showMsecs) {
    //     formatted = `${minutes < 10 ? 0 : ""
    //         }${minutes} : ${seconds < 10 ? 0 : ""}${seconds} . ${me}`;
    // } else {
    //     formatted = `${hours < 10 ? 0 : ""}${hours} : ${
    //         minutes < 10 ? 0 : ""
    //         }${minutes} : ${seconds < 10 ? 0 : ""}${seconds}`;
    // }

    return formatted;
}


type PropsType = {
    start: boolean,
    reset: boolean,
    msecs: boolean,
    options: Object,
    handleFinish: void,
    totalDuration: Number,
}

class Timer extends Component {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            started: false,
            remainingTime: props.totalDuration,
        };
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
        this.formatTime = this.formatTime.bind(this);
        const width = props.msecs ? 220 : 150;

    }

    componentDidMount() {
        if (this.props.start) {
            this.start();
        }
    }

    componentWillReceiveProps(newProps) {

        if (newProps.start) {
            this.start();
        } else {
            this.stop();
        }
        if (newProps.reset) {
            this.reset(newProps.totalDuration);
        }
    }

    start() {
        const handleFinish = this.props.handleFinish ? this.props.handleFinish : () => Alert.alert("Timer Finished");
        const endTime = new Date().getTime() + this.state.remainingTime;

        if (this.interval) clearInterval(this.interval);

        this.interval = setInterval(() => {
            const remaining = endTime - new Date();
            if (remaining <= 1000) {
                this.setState({ remainingTime: 0 });
                this.stop();
                handleFinish();
                return;
            }
            this.setState({ remainingTime: remaining });
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    reset(newDuration) {
        this.setState({
            remainingTime:
                this.props.totalDuration !== newDuration ?
                    newDuration :
                    this.props.totalDuration
        });
    }

    formatTime() {
        const { msecs } = this.props;
        const now = this.state.remainingTime;
        const formatted = formatTimeString(now, msecs);

        return formatted;
    }

    render() {

        const styles = this.props.options ? this.props.options : this.defaultStyles;

        return (
            // <View style={styles.container}>
            //     <Text style={styles.text}>{this.formatTime()}</Text>
            //     {/*<TextInput value={this.formatTime()} style={styles.text}/>*/}
            // </View>
            <Text
                style={[style.text_sb, {
                    color: colors.WHITE_COLOR,
                    fontSize: 15,
                }]}>
                ({this.formatTime()})
            </Text>

        );
    }
}

export default Timer;