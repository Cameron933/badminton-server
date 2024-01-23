Data Structure:

- Player: { name, wins, losses, primaryPoints, secondaryPoints, opponents[] }

Functions:

- calculatePoints(matchResults):

  - For each match result:
    - Update win/loss count for each player.
    - Calculate primary and secondary points.
    - Update players' opponents list.

- rankPlayers(players):

  - Sort players by primary points, then by secondary points as a tiebreaker.

- generatePairings(players):

  - Ensure point difference <= 10 and players haven't faced each other before.
  - Return pairings for the next round.

- inputMatchResults(data):

  - Parse and store match results.
  - Call calculatePoints and update player records.

- getRankings():
  - Return rankings based on current player data.
- getNextRoundPairings():
  - Use rankPlayers and generatePairings to determine matchups.
