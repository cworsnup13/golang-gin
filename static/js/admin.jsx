const AUTH0_CLIENT_ID = "j4zdupDcq4lJPU2tJ9AfeypYwMyu7dIw"
const AUTH0_DOMAIN = "dev-bh3jb8sq.auth0.com"
const AUTH0_CALLBACK_URL = location.href;
const AUTH0_API_AUDIENCE = "https://calvinandkarrisa.com"
var ALLOWED_USERS = ["calvin.worsnup", "karrisa.m.alcera"]


class App extends React.Component {
  parseHash() {
    this.auth0 = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID
    });
    this.auth0.parseHash(window.location.hash, (err, authResult) => {
      if (err) {
        return console.log(err);
      }

      if (
        authResult !== null &&
        authResult.accessToken !== null &&
        authResult.idToken !== null
      ) {
        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem(
          "profile",
          JSON.stringify(authResult.idTokenPayload)
        );
        window.location = window.location.href.substr(
          0,
          window.location.href.indexOf("#")
        );
      }
    });
  }
//JSON.parse(this.localStorage.profile)["nickname"] contains
  setup() {
    $.ajaxSetup({
      beforeSend: (r) => {
        if (localStorage.getItem("access_token")) {
          r.setRequestHeader(
            "Authorization",
            "Bearer " + localStorage.getItem("access_token")
          );
        }
      }
    });
  }

  checkAllowedUsers(){
    var nickname = "";
    if (localStorage.profile){
      nickname = JSON.parse(localStorage.profile)["nickname"];
    }

    if (ALLOWED_USERS.includes(nickname)){
      return true;
    }
    return false;
  }

  setState() {
    let idToken = localStorage.getItem("id_token");
    if (idToken) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  componentWillMount() {
    this.setup();
    this.parseHash();
    this.setState();
  }

  render() {
    var allowed = this.checkAllowedUsers();
    if (this.loggedIn && allowed) {
      return <LoggedIn/>;
    }
    return <Home/>;
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'What\'s the magic word??'};
    this.handleChange = this.handleChange.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  check_password(trial) {
    if (trial === "YES") {
      return true;
    }
    return false;
  }

  authenticate() {
    if (!this.check_password(this.state.value)){
      alert("Sorry incorrect password");
      return;
    }

    this.WebAuth = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      scope: "openid profile",
      audience: AUTH0_API_AUDIENCE,
      responseType: "token id_token",
      redirectUri: AUTH0_CALLBACK_URL
    });
    this.WebAuth.authorize();
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
    this.state = {
      jokes: []
    };
    this.serverRequest = this.serverRequest.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("profile");
    location.reload();
  }

  serverRequest() {
    $.get(AUTH0_API_AUDIENCE + "/api/jokes", res => {
      this.setState({
        jokes: res
      });
    });
  }

  componentDidMount() {
    this.serverRequest();
  }

  render() {
    return (
      <div className="container">
        <br/>
        <span className="pull-right">
                <a onClick={this.logout}>Log out</a>
              </span>
        <h2>Jokeish</h2>
        <p>Let's feed you with some funny Jokes!!!</p>
        <div className="row">
          <div className="container">
            {this.state.jokes.map(function (joke, i) {
              return <Joke key={i} joke={joke}/>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

class Joke extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: "",
      jokes: []
    };
    this.like = this.like.bind(this);
    this.serverRequest = this.serverRequest.bind(this);
  }

  like() {
    let joke = this.props.joke;
    this.serverRequest(joke);
  }

  serverRequest(joke) {
    $.post(
      AUTH0_API_AUDIENCE + "/api/jokes/like/" + joke.id,
      {like: 1},
      res => {
        console.log("res... ", res);
        this.setState({liked: "Liked!", jokes: res});
        this.props.jokes = res;
      }
    );
  }

  render() {
    return (
      <div className="col-xs-4">
        <div className="panel panel-default">
          <div className="panel-heading">
            #{this.props.joke.id}{" "}
            <span className="pull-right">{this.state.liked}</span>
          </div>
          <div className="panel-body">{this.props.joke.joke}</div>
          <div className="panel-footer">
            {this.props.joke.likes} Likes &nbsp;
            <a onClick={this.like} className="btn btn-default">
              <span className="glyphicon glyphicon-thumbs-up"/>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

