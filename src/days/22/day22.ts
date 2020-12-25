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

interface GameState {
  game: number;
  previousRounds: Set<string>;
  totalGames: number;
}

type Printer = (text?: string) => void;

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
    throw RangeError("Invalid player cards");
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

function playGame(player1: Player, player2: Player, print?: Printer): Player {
  let round = 1;
  while (true) {
    if (print) {
      print(`-- Round ${round} --`);
      print(`Player ${player1.number}'s deck: ${player1.cards.join(", ")}`);
      print(`Player ${player2.number}'s deck: ${player2.cards.join(", ")}`);
    }

    const result = playRound(player1, player2);
    if (print) {
      print(`Player ${player1.number} plays: ${result.player1Card}`);
      print(`Player ${player2.number} plays: ${result.player2Card}`);
      print(`Player ${result.winner.number} wins the round!`);
      print();
    }

    if (!player1.cards.length) {
      return player2;
    } else if (!player2.cards.length) {
      return player1;
    }
    ++round;
  }
}

function getRoundKey(player1: Player, player2: Player): string {
  return `${player1.cards.join(",")}|${player2.cards.join(",")}}`;
}

function playRecursiveRound(player1: Player, player2: Player, gameState: GameState, print?: Printer): Round {
  gameState.previousRounds.add(getRoundKey(player1, player2));
  const player1Card = player1.cards.shift();
  const player2Card = player2.cards.shift();
  let winner: Player;
  if (!player1Card || !player2Card) {
    throw RangeError("Invalid player cards");
  }

  if (print) {
    print(`Player ${player1.number} plays: ${player1Card}`);
    print(`Player ${player2.number} plays: ${player2Card}`);
  }
  if (player1.cards.length >= player1Card && player2.cards.length >= player2Card) {
    const subPlayer1: Player = {
      number: player1.number,
      cards: player1.cards.slice(0, player1Card)
    };
    const subPlayer2: Player = {
      number: player2.number,
      cards: player2.cards.slice(0, player2Card)
    };
    if (print) {
      print("Starting sub-game...");
      print();
    }

    const subGameState: GameState = {
      game: gameState.totalGames + 1,
      previousRounds: new Set(),
      totalGames: gameState.totalGames
    };
    const subWinner = playRecursiveGame(subPlayer1, subPlayer2, subGameState, print);
    gameState.totalGames = subGameState.totalGames;

    if (subWinner.number == player1.number) {
      winner = player1;
      player1.cards.push(player1Card, player2Card);
    } else {
      winner = player2;
      player2.cards.push(player2Card, player1Card);
    }
    if (print) {
      print(`=== GAME ${gameState.game} ===`);
      print();
    }
  } else {
    if (player1Card > player2Card) {
      winner = player1;
      player1.cards.push(player1Card, player2Card);
    } else if (player2Card > player1Card) {
      winner = player2;
      player2.cards.push(player2Card, player1Card);
    } else {
      throw RangeError("Invalid card deck");
    }
  }

  return {
    player1Card,
    player2Card,
    winner
  };
}

function playRecursiveGame(player1: Player, player2: Player, gameState: GameState, print?: Printer): Player {
  if (print) {
    print(`=== GAME ${gameState.game} ===`);
    print();
  }
  ++gameState.totalGames;
  let round = 1;
  while (true) {
    if (gameState.previousRounds.has(getRoundKey(player1, player2))) {
      if (print) {
        print(`Player ${player1.number} wins the game!`);
      }
      return player1;
    }

    if (print) {
      print(`-- Round ${round} --`);
      print(`Player ${player1.number}'s deck: ${player1.cards.join(", ")}`);
      print(`Player ${player2.number}'s deck: ${player2.cards.join(", ")}`);
    }
    const result = playRecursiveRound(player1, player2, gameState, print);
    if (print) {
      print(`Player ${result.winner.number} wins round ${round} of game ${gameState.game}!`);
      print();
    }

    if (!player1.cards.length) {
      if (print) {
        print(`Player ${player2.number} wins game ${gameState.game}!`);
        print();
      }
      return player2;
    } else if (!player2.cards.length) {
      if (print) {
        print(`Player ${player1.number} wins game ${gameState.game}!`);
        print();
      }
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
  const winner = playGame(players[0], players[1], (showRounds ? output.print : undefined));
  output.print(`Player ${winner.number} wins the game!`);
  output.print(`Winning score: ${calculateScore(winner.cards)}`);
  output.print();
}

function runPuzzle2(input: string[], showRounds: boolean, output: OutputPublic) {
  const players = getPlayers(input);
  const gameState: GameState = {
    game: 1,
    previousRounds: new Set(),
    totalGames: 0
  };
  const winner = playRecursiveGame(players[0], players[1], gameState, (showRounds ? output.print : undefined));
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
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      runPuzzle2(input, true, output);
    },
    runPuzzle2(input: string[]) {
      runPuzzle2(input, false, output);
    }
  };
}
