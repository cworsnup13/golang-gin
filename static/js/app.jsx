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
    this.state = {value: 'What\'s the magic word??', valid: false};
    this.handleChange = this.handleChange.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.check_password = this.check_password.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
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
      }
    );
  }

  authenticate() {
    this.check_password(this.state.value);
    console.log(this.state.valid);
    if (!this.state.valid){
      alert("Sorry incorrect password");
      return;
    }
    localStorage.setItem("allowed", true);
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

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
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
        <p className="welcome-prompt">You're in</p>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

