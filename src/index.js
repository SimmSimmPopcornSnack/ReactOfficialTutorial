import React from 'react';
import ReactDOM from 'react-dom';
// import Text from 'react-native';
import ToggleButton from "react-toggle-button";
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            <span style={props.highlighted ? {color: "orange"} : {color: "black"}}>
                {props.value}
            </span>
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlighted={this.props.highlighted[i]}
        />;
    }
    render() {
        return (
            <div>
                {[0,3,6].map((value, index) => {
                    return (
                        <div className="board-row" key={index}>
                            {this.renderSquare(0 + value)}
                            {this.renderSquare(1 + value)}
                            {this.renderSquare(2 + value)}
                        </div>);
                })}
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
                location: null,
                move: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            listReverse: false,
        };
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const calculatedWinner = calculateWinner(current.squares);
        const winner = calculatedWinner.square;

        const moves = (this.state.listReverse ? history.slice().reverse() : history).map((step, index) => {
            let move = step.move;
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const location = step.location;
            let locDesc = "";
            if(0 < move) {
                locDesc = "(" + Math.floor(location/3) + ", " + (location%3) + ")";
            }

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        <span style={move === this.state.stepNumber ? {fontWeight: "bold"} : {fontWeight: "normal"}}>
                            {desc}
                        </span>
                    </button>
                    {locDesc}
                </li>
            );
        });

        let status;
        if(winner) {
            if(winner==="-") {
                status = "Draw";
            } else {
                status = 'Winner: ' + winner;
            }
        } else {
            status = 'Next plater: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i)=> this.handleClick(i)}
                        highlighted = {calculatedWinner.highlighted}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        Reverse list:
                        <ToggleButton
                            value={this.state.listReverse}
                            onToggle={(value) => {
                                this.setState({
                                    listReverse: !value,
                                })
                            }}/>
                    </div>
                    <ol reversed={this.state.listReverse}>{moves}</ol>
                </div>
            </div>
        );
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares).square || squares[i]) return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: [...history,
                {
                    squares: squares,
                    location: i,
                    move: history.length,
                }],
            // history: history.concat([{
            //     squares: squares,
            // }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
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
    for(let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            let highlighted = Array(9).fill(false);
            highlighted[a] = highlighted[b] = highlighted[c] = true;
            return {
                square: squares[a],
                highlighted: highlighted,
            };
        }
    }
    if (squares.findIndex((el) => el === null) === -1) {
        return {
            square: "-",
            highlighted: Array(9).fill(false),
        };
    }
    else {
        return {
            square: null,
            highlighted: Array(9).fill(false),
        };
    }
}
// ==========================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


