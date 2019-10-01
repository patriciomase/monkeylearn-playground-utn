import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "./styles.css";

const apiUrl =
  "https://api.monkeylearn.com/v3/classifiers/cl_o46qggZq/classify/";

const Loading = () => <div className="lds-dual-ring" />;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "ready",
      text: "",
      tags: []
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
        <h1>MonkeyLearn Playground</h1>
        <h2>Enter the text you want to classify</h2>
        {this.state.status === "ready" && (
          <>
            <textarea
              value={this.state.text}
              onChange={e => {
                this.setState({ text: e.target.value });
              }}
            />
            <button onClick={e => this.queryApi()}>Classify!</button>
          </>
        )}
        {this.state.status === "loading" && <Loading />}
        {this.state.status === "fetched" && (
          <div>
            {this.state.tags.map(t => (
              <div className="tag">{t.name}</div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
