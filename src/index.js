import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square " + (props.isWinner ? "square-winner" : "")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        isWinner={this.props.winnerSquares.indexOf(i) > -1}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    const rowNum = 3;
    const colNum = 3;
    let boardRowList = [];
    for (let row = 0; row < rowNum; row++) {
      let boardRow = [];
      for (let col = 0; col < colNum; col++) {
        boardRow.push(this.renderSquare(row*colNum + col));
      }
      let boardRowEl = <div key={row} className="board-row">{boardRow}</div>;
      boardRowList.push(boardRowEl);
    }

    return (
      <div>
        {boardRowList}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        squareNum: null
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscSort: true
    };
  }

  toggleSort() {
    this.setState((prevState) => {
      return { isAscSort: !prevState.isAscSort };
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares).length || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        squareNum: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = calculateWinner(current.squares);
    let moves = history.map((step, move) => {
      const COLUMNS_IN_A_ROW = 3;
      let squareNum = step.squareNum;
      let col = squareNum % COLUMNS_IN_A_ROW;
      let row = parseInt(squareNum / COLUMNS_IN_A_ROW, 0);
      const desc = move ?
        `Go to move #${move} (${col},${row})` :
        'Go to game start';
      return (
        <li key={move}>
          <button className={this.state.stepNumber === move ? "selected-move-btn" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    moves = this.state.isAscSort ? moves : moves.reverse();

    let status;
    if (winnerSquares.length) {
      status = 'Winner: ' + current.squares[winnerSquares[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winnerSquares}
            onClick={(i) => this.handleClick(i)}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.toggleSort()}>Toggle sort:</button> {this.state.isAscSort ? "asc" : "desc"}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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
      return [a, b, c];
    }
  }
  return [];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
