/***************************************************************************
  This is the component for the list of all Entries in the dictionary.
  When it renders, it must map the functions "select" and "remove" with
  the correct key for the given Entry to every Entry in the dictionary.

  The functions "select" and "remove" are passed in through the props
  because both functions need to be able to setState at the top level
  of the dictionary.
***************************************************************************/

var React = require('react');

module.exports = React.createClass({
  render: function() {
    var self = this;
    var output;
    var entries = self.props.entries;
    return (
      <div id="table-of-contents">
          {
          Object.keys(entries).map(function(current, index) {
             output = "[Empty]";
             if (entries[current].word != "") {
                output = entries[current].word;
              }
              if(typeof(entries[current]) !== "string") {
                return (
                  <div key={"entry"+index} className="entry">
                    <ul className="nav nav-sidebar" id="line">
                      <div onClick={self.props.select(current)} id="word" className="line"><li><a>{output}</a></li></div>
                      <div onClick={self.props.remove(current)} id="delete" className="line">[Delete]</div>
                    </ul>
                    <br/>
                  </div>
                );
              }
            })
          }

      </div>
    )
  }
});
