/***************************************************************************
  This is the main file/component that will be loaded upon hitting the
  root route (home page).

  The "doc" object comes from the collection
  "temporary" and it has an id of "name-of-dictionary".

  A Dictionary component is then created in the callback of
  doc.subcribe so that doc.data can be captured.

  Near the end, the Dictionary is re-rendered every time the "op" event
  is emitted from "doc". This is the magic behind the real-time
  functionality.

  Find all of the other components in the "app/components" directory.
***************************************************************************/

window.sharedb = require("sharedb/lib/client");

var React = require('react');
var ReactDOM = require('react-dom');

var Entry = require('./components/Entry.jsx');
var TableOfContents = require('./components/TableOfContents.jsx');

var socket = new BCSocket('/channel');
var connection = new window.sharedb.Connection(socket);
var doc = connection.get("temporary", "name-of-dictionary");

var makeKey = require("./functions.js").makeKey;

doc.subscribe(function(error) {
  var Dictionary;
  if (error) {
    console.log("Failed to subscribe.", error);
  } else {
    if (!doc.type) {
      doc.create({});
    }

    Dictionary = React.createClass({
      getInitialState: function() {
        return {entries: doc.data};
      },
      //resets the "entry" field of the state in order to display that entry
      selectEntry: function(key) {
        var self = this;
        return (function() {
          self.setState({
            entries: doc.data,
            entry: doc.data[key],
            key: key
          });
        });
      },
      addEntry: function() {
        var self = this;
        var key = makeKey();
        var ins_obj = {word: "", path: [key], meanings: {} };
        doc.submitOp([{p: [key], oi: ins_obj}], function() {
          self.setState({
            entries: doc.data,
            entry: doc.data[key],
            key: key
          });
        });
      },
      deleteEntry: function(key) {
        var self = this;
        return (
          function() {
            doc.submitOp([{p: [key], od: doc.data[key]}], function() {
              self.setState({
                entries: doc.data
              });
            });
          }
        );
      },
      render: function() {
        var self = this;
        return (
          <div>
              <nav className="navbar navbar-inverse navbar-fixed-top"  id="sil-navbar">
                <div className="container-fluid">
                  <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                      <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" id="sil-navbar-brand">Realtime Dictionary</a>
                  </div>

                  <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav navbar-right">
                      <li><a>My Projects</a></li>
                      <li><a>Learn</a></li>
                      <li><a>Discuss</a></li>
                      <li><a>Profile Settings</a></li>
                    </ul>
                  </div>
                </div>
              </nav>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-3 col-md-2 sidebar">
                    <ul className="nav nav-sidebar">
                      <li className="active"><a>Word List<span className="sr-only"></span></a></li>
                    </ul>
                    <button className="addEntry" onClick={this.addEntry}>Add Entry</button>
                    <TableOfContents entries={this.state.entries} select={self.selectEntry} remove={self.deleteEntry}/>
                  </div>
                  <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" margin-top="-25px">
                    <h1 className="page-header">
                      <img src="lf_logo-beta.png" alt="Language Forge" id="sil-img"></img>
                      Realtime Dictionary
                    </h1>
                    <Entry entry={doc.data[self.state.key]} doc={doc}/>
                  </div>
                </div>
              </div>
          </div>
        )
      }
    });
  }

  //rerender the Dictionary on every operation to provide real-time functionality
  doc.on("op", function() {
    ReactDOM.render(<Dictionary />, the_div);
  });

  ReactDOM.render(<Dictionary />, the_div);
});
