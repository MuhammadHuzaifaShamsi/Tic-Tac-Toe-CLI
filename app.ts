#! /usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';

type Board = string[][];

const Player_X = chalk.green('X');
const Player_O = chalk.blue('O');


function createBoard(): Board {
    return [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
}


function displayBoard(board: Board): void {
    console.log("\n" + board.map(row => row.map(cell => cell === ' ' ? chalk.gray(cell) : cell).join(' | ')).join('\n---------\n'));
}

function isGameOver(board: Board): boolean {
    for (let row of board) {
        if (row[0] !== ' ' && row[0] === row[1] && row[0] === row[2]) {
            return true;
        }
    }

    for (let i = 0; i < 3; i++) {
        if (board[0][i] !== ' ' && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
            return true;
        }
    }

    if (board[0][0] !== ' ' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return true;
    }
    if (board[0][2] !== ' ' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return true;
    }

    if (!board.flat().includes(' ')) {
        return true;
    }

    return false;
}


function getCurrentPlayerSymbol(turn: number): string {
    return turn % 2 === 0 ? Player_X : Player_O;
}


async function getPlayerMove(board: Board, turn: number): Promise<[number, number]> {
    const currentPlayerSymbol = getCurrentPlayerSymbol(turn);
    const question: inquirer.Question = {
        type: 'input',
        name: 'move',
        message: `Player ${currentPlayerSymbol}, enter your move (row, column):`
    };
    const answer = await inquirer.prompt([question]);
    const [row, col] = answer.move.split(',').map(coord => parseInt(coord.trim()) - 1);
    if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2 || board[row][col] !== ' ') {
        console.log(chalk.red('Invalid move! Please enter row and column numbers between 1 and 3 for an empty cell.'));
        return getPlayerMove(board, turn);
    }
    return [row, col];
}


async function playTicTacToe() {
    let board = createBoard();
    let turn = 0;

    while (!isGameOver(board)) {
        displayBoard(board);
        const [row, col] = await getPlayerMove(board, turn);
        const currentPlayerSymbol = getCurrentPlayerSymbol(turn);
        board[row][col] = currentPlayerSymbol;
        turn++;
    }

    displayBoard(board);
    const winner = isGameOver(board) ? getCurrentPlayerSymbol(turn - 1) : 'Tie';
    console.log(winner === 'Tie' ? chalk.yellow('It\'s a tie!') : `Player ${winner} ${chalk.green('wins!')}`);
}

playTicTacToe();
