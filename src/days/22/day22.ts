import { OutputPublic } from "@/functions/output";

type Deck = number[];

interface Player {
  number: number;
  cards: Deck;
}

interface Round {
  player1Card: number;
  player2Card: number;
  winner: Player;
}

type Printer = (text?: string) => void;
const nullPrinter: Printer = () => undefined;

function getPlayers(input: string[]): Player[] {
  const players: Player[] = [];
  const re = /^Player\s+(\d+):$/;
  input.join("\n").split("\n\n").map(line => line.split("\n")).forEach(player => {
    const match = re.exec(player[0]);
    if (match) {
      players.push({
        number: +match[1],
        cards: player.slice(1).map(card => +card)
      });
    }
  });
  return players;
}

function playRound(player1: Player, player2: Player): Round {
  const player1Card = player1.cards.shift();
  const player2Card = player2.cards.shift();
  if (!player1Card || !player2Card) {
    throw RangeError("Invalid card deck");
  }

  let winner: Player;
  if (player1Card > player2Card) {
    winner = player1;
    player1.cards.push(player1Card, player2Card);
  } else if (player2Card > player1Card) {
    winner = player2;
    player2.cards.push(player2Card, player1Card);
  } else {
    throw RangeError("Invalid card deck");
  }
  return {
    player1Card,
    player2Card,
    winner
  };
}

function playGame(player1: Player, player2: Player, print: Printer = nullPrinter): Player {
  let round = 1;
  while (true) {
    print(`-- Round ${round} --`);
    print(`Player ${player1.number}'s deck: ${player1.cards.join(", ")}`);
    print(`Player ${player2.number}'s deck: ${player2.cards.join(", ")}`);

    const result = playRound(player1, player2);
    print(`Player ${player1.number} plays: ${result.player1Card}`);
    print(`Player ${player2.number} plays: ${result.player2Card}`);
    print(`Player ${result.winner.number} wins the round!`);
    print();

    if (!player1.cards.length) {
      return player2;
    } else if (!player2.cards.length) {
      return player1;
    }
    ++round;
  }
}

function calculateScore(cards: Deck): number {
  return cards.reduce((score, card, i) => score + card * (cards.length - i), 0);
}

function runPuzzle1(input: string[], showRounds: boolean, output: OutputPublic) {
  const players = getPlayers(input);
  const winner = playGame(players[0], players[1], (showRounds ? output.print : nullPrinter));
  output.print(`Player ${winner.number} wins the game!`);
  output.print(`Winning score: ${calculateScore(winner.cards)}`);
  output.print();
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      runPuzzle1(input, true, output);
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      runPuzzle1(input, false, output);
    }
  };
}
