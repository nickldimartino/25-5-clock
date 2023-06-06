import React from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

// The App component is a stateful component because it tracks and manages data
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breaklength: 5,           // length of the break time
      sessionLength: 25,        // length of the session time
      timer: 25 * 60,           // timer initialized to 25 minutes in seconds
      timerLabel: "Session",    // label for the timer (Session or Break)
      toStartStop: false        // flag to determine if the timer has been started or stopped
    }
    // bind the methods to the App component
    this.startStop = this.startStop.bind(this);
    this.reset = this.reset.bind(this);
    this.setTimeFormat = this.setTimeFormat.bind(this);
    this.changeLength = this.changeLength.bind(this);
    this.decBreakLength = this.decBreakLength.bind(this);
    this.incBreakLength = this.incBreakLength.bind(this);
    this.decSessionLength = this.decSessionLength.bind(this);
    this.incSessionLength = this.incSessionLength.bind(this);
    
    // ID of the timer
    this.timerId = undefined;
  }
  
  // right before the App component is destroyed, clear the timer ID interval 
  componentWillUnmount() {
    clearInterval(this.timerId);
  }
  
  // start and Stop the timer
  startStop() {
    // if the timer is started, clear the timer interval and set the timer to Stop. Else, set the timer to Start
    if (this.state.toStartStop) {
      clearInterval(this.timerId);
      this.setState({
        toStartStop: false
      });
    } else {
      this.setState({
        toStartStop: true
      });
      
      // Every second (1000 ms) subtract the timer by 1 second or start the next timer (Session or Break)
      this.timerId = setInterval(() => {
        // if the timer is at 0, reset the timer to the break length and count down the break timer, else count down 1 second
        if (this.state.timer === 0) {
          this.setState({
            timerLabel: (this.state.timerLabel === "Session") ? "Break" : "Session",
            timer: (this.state.timerLabel === "Session") ? (this.state.breaklength * 60) : (this.state.sessionLength * 60)
          });
          
          // play a sound when the timer has finished
          document.getElementById("beep").play();
        } else {
          this.setState({
            timer: this.state.timer - 1
          });
        }
      }, 1000);
    }
  }
  
  // reset the current timer values to their default values
  reset() {
    this.setState({
        breaklength: 5,
        sessionLength: 25,
        timer: 25 * 60,
        timerLabel: "Session",
        toStartStop: false
    });
    
    // reset the timer id
    clearInterval(this.timerId);
    
    // pause the audio sound and set it's time-to-play to 0
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  }
  
  // return the converted timer value in MM:SS format
  setTimeFormat(length) {
    let minutes = Math.floor(length / 60);
    let seconds = length % 60;
    
    minutes = minutes < 10 ? ("0" + minutes) : minutes;
    seconds = seconds < 10 ? ("0" + seconds) : seconds;
    
    return `${minutes}:${seconds}`;
  }
  
  // change the length  of time for the break and sessions lengths
  changeLength(length, timerLabelType) {
    let newLength;
    
    // if the timer label is Session, use sessionLength, else use breakLength
    if (timerLabelType === "Session") {
      newLength = this.state.sessionLength + length;
    } else {
      newLength = this.state.breaklength + length;
    }
    
    // if the new length is between 1 and 60 inclusive and the timer is stopped, set the current timer (Session or Break) to the new length 
    if (newLength > 0 && newLength < 61 && !this.state.toStartStop)  {
      this.setState({
        [`${this.state.timerType}Length`]: newLength
      });
      
      // if the timer label is the same as the time (Session to Session or Break to Break) set the timer value to the new set time (in seconds)
      if(this.state.timerLabel.toLowerCase() === timerLabelType) {
        this.setState({
          timer: newLength * 60
        })
      }
    }
  }
  
  // decrease the breakLength
  decBreakLength() {
    // the breakLength must be more than 1 to function
    if (this.state.breaklength > 1)  {
      // if the timer is start and the label is set to Break, subtract the breakLength by 1
      // and set the timer to the new breakLength (in seconds). Else, only subtract the breakLength
      if(!this.state.toStartStop && this.state.timerLabel === "Break") {
        this.setState({
          breaklength: this.state.breaklength - 1,
          timer: (this.state.breaklength - 1) * 60
        });
      } else {
        this.setState({
          breaklength: this.state.breaklength - 1,
        });
      }
    }
  } 
  
  // increase the breakLength
  incBreakLength() {
    // the breakLength must be less than 60 to function
    if (this.state.breaklength < 60) {
      // if the timer is start and the label is set to Break, add 1 to the breakLength
      // and set the timer to the new breakLength (in seconds). Else, only add to the breakLength
      if (!this.state.toStartStop && this.state.timerLabel === "Break") {
        this.setState({
          breaklength: this.state.breaklength + 1,
          timer: (this.state.breaklength + 1) * 60
        });
      } else {
        this.setState({
          breaklength: this.state.breaklength + 1,
        });
      }
    }
  }
  
  // decrease the sessionLength
  decSessionLength() {
    // the breakLength must be more than 1 to function
    if (this.state.sessionLength > 1) {
      // if the timer is start and the label is set to Session, subtract the sessionLength by 1
      // and set the timer to the new sessionLength (in seconds). Else, only subtract the sessionLength
      if (!this.state.toStartStop && this.state.timerLabel === "Session") {
        this.setState({
          sessionLength: this.state.sessionLength - 1,
          timer: (this.state.sessionLength - 1) * 60
        });
      } else {
        this.setState({
          sessionLength: this.state.sessionLength - 1,
        });
      }
    }
  }
  
  // increase the sessionLength
  incSessionLength() {
    // the breakLength must be less than 60 to function
    if (this.state.sessionLength < 60) {
      // if the timer is start and the label is set to Session, add 1 to the sessionLength
      // and set the timer to the new sessionLength (in seconds). Else, only add to the sessionLength
      if (!this.state.toStartStop && this.state.timerLabel === "Session") {
       this.setState({
         sessionLength: this.state.sessionLength + 1,
         timer: (this.state.sessionLength + 1) * 60
        });
      } else {
        this.setState({
          sessionLength: this.state.sessionLength + 1,
        });
      }
    }
  }
  
  // render the necessary elements
  render () {
    return (
      <div id="container">
        <h1 id="clock-header">25 + 5 Clock</h1>
        <div id="time-length-controls">
          <div id="break-label">Break Length
            <div className="controls">
              <div id="break-decrement" onClick={this.decBreakLength}>-</div>
              <div id="break-length">{this.state.breaklength}</div>
              <div id="break-increment" onClick={this.incBreakLength}>+</div>
            </div>
          </div>
          <div id="session-label">Session Length
            <div className="controls">
              <div id="session-decrement" onClick={this.decSessionLength}>-</div>
              <div id="session-length">{this.state.sessionLength}</div>
              <div id="session-increment" onClick={this.incSessionLength}>+</div>
            </div>
          </div>
        </div>
        <div id="timer">
          <div id="timer-label">{this.state.timerLabel}</div>
          <div id="time-left">{this.setTimeFormat(this.state.timer)}</div>
        </div>
        <div id="time-controls">
          <div id="start_stop" onClick={this.startStop}>Start/Stop</div>
          <div id="reset" onClick={this.reset}>Reset</div>
        </div>
      </div>
    );
  }
}

// render the App component and link it to the app element
ReactDOM.render(<App />, document.getElementById("app"));