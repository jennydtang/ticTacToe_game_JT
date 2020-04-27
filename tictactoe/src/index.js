import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

//class Square extends React.Component {
//parent component passes stated down to children by using props; keeps child components in sync with each other and parent
//add a constructor to initialize the state
// constructor(props) {
//   super(props); //need to call a super when defining constructor of subclass; all react component classes have constructor that start with super(props)call
//   this.state = {
//     //this.state is private to a React component that it's defined in
//     value: null,
//   };
// }
//No longer need constructor because square no longer keeps track of the game
//render(i) {

//function components are a simpler way to write components that only contain render method and don't have their own state
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true, //x is set as first move by default now (a boolean)
  //   };
  // }

  renderSquare(i) {
    return (
      //need parenthesis so JS doesn't insert ; and break code
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    //using two loops to make squares
    const boardSize = 3;
    let squares = [];
    //outer loop runs one time
    for (let i = 0; i < boardSize; i++) {
      //inner loop runs three times
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        //adds a square each time (three squares to the row)
        row.push(this.renderSquare(i * boardSize + j)); //the equation sets index number for square(0,1,2,3,4,5,6,7,8,9)
      }
      squares.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return <div>{squares}</div>;

    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = "Winner: " + winner;
    // } else {
    //   status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    // }

    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
  }
}

class Game extends React.Component {
  //initialize state for the game component within it's constructor
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  //Define handleClick
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); //.slice used to create a copy of squares array to modify
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          recentLocation: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const recentLocation = step.recentLocation;
      const col = 1 + (recentLocation % 3);
      const row = 1 + Math.floor(recentLocation / 3);
      const desc = move
        ? "This was move #" + move + " taken at Col: " + col + ", Row: " + row
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {/* If move is current step, return the move in bold into desc */}
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

serviceWorker.unregister();
