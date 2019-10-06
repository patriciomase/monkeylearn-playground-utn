import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "./styles.css";

const initialState = {
  status: "ready",
  text: "",
  tags: []
};

const apiUrl =
  "https://api.monkeylearn.com/v3/classifiers/cl_o46qggZq/classify/";

const Loading = () => <div className="lds-dual-ring" />;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState
    };
  }

  queryApi = () => {
    this.setState({ status: "loading" });
    axios
      .post(
        apiUrl,
        {
          data: [this.state.text]
        },
        {
          headers: {
            Authorization: "Token 271242547b42bafb88a450186ce44e45a1970479"
          }
        }
      )
      .then(response => {
        this.setState({
          tags: response.data[0].classifications.map(c => ({
            name: c.tag_name,
            conf: c.confidence
          })),
          status: "fetched"
        });
      });
  };

  render() {
    return (
      <div className="App">
        <h1>MonkeyLearn Playground -- Topic classifier</h1>
        {this.state.status === "ready" && (
          <>
            <h2>Enter the text you want to classify</h2>
            <textarea
              value={this.state.text}
              onChange={e => {
                this.setState({ text: e.target.value });
              }}
            />
            <button onClick={e => this.queryApi()}>Classify ➡</button>
          </>
        )}
        {this.state.status === "loading" && <Loading />}
        {this.state.status === "fetched" && (
          <>
            <div className="classified">{this.state.text}</div>
            <div>
              <h2>Topics in the text:</h2>
            </div>
            <ul className="tags">
              {this.state.tags.map(t => (
                <li key={t.name} className="tag">
                  {t.name} ({t.conf})
                </li>
              ))}
            </ul>
            <button onClick={() => (this.setState = { ...initialState })}>
              Try again <span>♲</span>
            </button>
          </>
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
