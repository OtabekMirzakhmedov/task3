const crypto = require('crypto');

class HMAC {
  generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateHMAC(key, data) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
  }
}

class GameRule {
    constructor(moves) {
      this.moves = moves;
    }
  
    determineWinner(userMove, computerMove) {
      const userIndex = this.moves.indexOf(userMove);
      const computerIndex = this.moves.indexOf(computerMove);
  
      const halfLength = Math.ceil(this.moves.length / 2);
      const startIndex = userIndex + 1;
      const endIndex = userIndex + halfLength;
  
      const validMoves = this.moves.concat(this.moves);
  
      if (validMoves.slice(startIndex, endIndex).includes(computerMove)) {
        return 'Computer wins!';
      } else if (userIndex === computerIndex) {
        return "It's a draw!";
      } else {
        return 'You win!';
      }
    }
  }
  
  class Help {
    constructor(moves) {
      this.moves = moves;
      this.gameRule = new GameRule(this.moves);
    }
  
    generateHelpTable() {
      const table = [];
  
      const headerRow = ['PC Moves'].concat(this.moves);
      table.push(headerRow);
  
      for (let i = 0; i < this.moves.length; i++) {
        const row = [this.moves[i]];
  
        for (let j = 0; j < this.moves.length; j++) {
          const result = this.gameRule.determineWinner(this.moves[j], this.moves[i]);
          if (result === 'You win!') {
            row.push('Lose');
          } else if (result === 'Computer wins!') {
            row.push('Win');
          } else {
            row.push('Draw');
          }
        }
  
        table.push(row);
      }
  
      return table;
    }
  
    printHelpTable() {
      const table = this.generateHelpTable();
  
      const columnWidths = table[0].map((_, colIndex) => {
        return Math.max(...table.map((row) => String(row[colIndex]).length));
      });
  
      const horizontalLine = `+${columnWidths.map((width) => '-'.repeat(width + 2)).join('+')}+`;
  
      console.log(horizontalLine);
      table.forEach((row) => {
        const formattedRow = row.map((cell, colIndex) => {
          const padding = ' '.repeat(columnWidths[colIndex] - String(cell).length + 1);
          return ` ${cell}${padding}`;
        });
        console.log(`|${formattedRow.join('|')}|`);
        console.log(horizontalLine);
      });
    }
  }
  
class Game {
  constructor(moves) {
    this.moves = moves;
    this.gameRule = new GameRule(this.moves);
    this.hmac = new HMAC();
    this.key = this.hmac.generateKey();
    this.computerMove = this.generateComputerMove();
  }

  generateComputerMove() {
    const randomIndex = Math.floor(Math.random() * this.moves.length);
    return this.moves[randomIndex];
  }

  play(userMove) {
    const result = this.gameRule.determineWinner(userMove, this.computerMove);
    console.log(`Your move: ${userMove}`);
    console.log(`Computer move: ${this.computerMove}`);
    console.log(result);
    console.log(`HMAC key: ${this.key}`);
    const hmac = this.hmac.generateHMAC(this.key, this.computerMove);
    console.log(`HMAC: ${hmac}`);
  }
}

class Menu {
  constructor(moves) {
    this.moves = moves;
  }

  printMenu() {
    console.log('Available moves:');
    this.moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    });
    console.log('0 - exit');
    console.log('? - help');
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 3 || args.length % 2 === 0 || new Set(args).size !== args.length) {
    console.log('Invalid arguments. Please provide an odd number of unique moves.');
    console.log('Example: node rockPaperScissors.js rock paper scissors');
    return;
  }

  const help = new Help(args);
  const game = new Game(args);
  const menu = new Menu(args);

  menu.printMenu();

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your move: ', (answer) => {
    const moveIndex = parseInt(answer, 10);

    if (moveIndex === 0) {
      console.log('Exiting the game...');
    } else if (answer === '?') {
      help.printHelpTable();
    } else if (moveIndex >= 1 && moveIndex <= args.length) {
      game.play(args[moveIndex - 1]);
    } else {
      console.log('Invalid move. Please enter a valid move number.');
    }

    rl.close();
  });
}

main();
