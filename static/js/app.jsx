const AUTH0_API_AUDIENCE = "https://calvinandkarrisa.com"

class App extends React.Component {


  setup() {
  }

  setState() {
    let idToken = localStorage.getItem("allowed");
    if (idToken) {
      this.allowed = true;
    } else {
      this.allowed = false;
    }
  }

  componentWillMount() {
    this.setup();
    this.setState();
  }

  render() {
    if (this.allowed) {
      return <LoggedIn/>;
    }
    return <Home/>;
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'What\'s the magic word??',
      password: "",
      valid: false,
      guestType: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.check_password = this.check_password.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  authenticate() {
    this.check_password(this.state.value);
  }

  check_password(trial) {
    $.post(
      AUTH0_API_AUDIENCE + "/api/password",
      {password: trial},
      res => {
        console.log("res... ", res);
        this.setState({
          valid: res.valid
        });
        this.setState({
          guestType: res.guestType
        });
        this.setState({
          password: trial
        });
        this.post_attempt();
      },

    ).error(function() {
      alert("Sorry incorrect password");
    });
  }

  post_attempt() {
    localStorage.setItem("allowed", true);
    localStorage.setItem("guestType", this.state.guestType);
    localStorage.setItem("password", this.state.password);
    location.reload();
  }

  render() {
    return (
      <div className="calvin-container container">
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2 text-center">
            <img src="/static/img/candle.gif"></img>
            <p className="welcome-prompt">Calvin and Karrisa's wedding</p>
            <textarea value={this.state.value} onChange={this.handleChange}>
              What's the magic word??
            </textarea>
            <a
              onClick={this.authenticate}
              className="btn btn-primary btn-lg btn-login btn-block"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }
}

class CKCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {password: localStorage.getItem("password")};
  }

  componentDidMount() {
    $.post(
      AUTH0_API_AUDIENCE + "/api/calendar",
      {password: this.state.password},
      res => {
        console.log("res... ", res);
        this.draw_calendar(res);
      },

    ).error(function() {
      alert("Sorry incorrect password");
    });
  }

  draw_calendar(event_data) {
    $('#calendar').fullCalendar(event_data);
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div id='calendar'></div>
    );
  }
}

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guestType: localStorage.getItem("guestType"),
    };
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem("allowed");
    location.reload();
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="calvin-container container">
        <br/>
        <span className="pull-right">
                <a onClick={this.logout}>Log out</a>
              </span>
        <h2 className="welcome-prompt">Calvin and Karrisa's Wedding</h2>
        <p className="welcome-prompt">Welcome {this.state.guestType}</p>
        <CKCalendar />
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

