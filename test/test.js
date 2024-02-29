const request = require('supertest');
const assert = require('assert');
const app = require('../index'); // Adjust the path accordingly
const Game = require('../public/StaticGame'); // Adjust the path accordingly

describe('Ping Pong Game', () => {
  describe('GET /', () => {
    it('should return the main HTML page', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
          assert.strictEqual(res.status, 200);

          // Check for the existence of specific HTML elements or attributes
          assert.strictEqual(res.text.includes('<h1>Multiplayer-PingPong</h1>'), true);
          assert.strictEqual(res.text.includes('<input id="input-username" type="text" name="username" value="" />'), true);
          assert.strictEqual(res.text.includes('<canvas id="drawing-canvas" width="600" height="500"></canvas>'), true);

          done(err);
        });
    });
  });

  describe('Socket Connection', () => {
    it('should connect to the socket server', (done) => {
      const socket = require('socket.io-client')('http://localhost:3000'); // Adjust the URL if needed

      socket.on('connect', () => {
        assert.strictEqual(socket.connected, true);
        socket.disconnect();
        done();
      });
    });

    // Add more tests for socket events and game functionality
  });

  describe('Game Logic', () => {
    describe('Game Initialization', () => {
      it('should initialize a game with correct initial values', () => {
        const game = new Game('player1', 'Player 1', 'player2', 'Player 2');
        
        assert.strictEqual(game.players['player1'].score, 0);
        assert.strictEqual(game.players['player2'].score, 0);
        assert.deepStrictEqual(game.ball, [20, 50]);
        assert.deepStrictEqual(game.ball_velocity, [1, 0]); // Assuming MIN_SPEED is 1
      });
    });

    describe('Game Update', () => {
      it('should update the game state correctly after scoring', () => {
        const game = new Game('player1', 'Player 1', 'player2', 'Player 2');

        // Score a goal for player 1
        game.ball = [100, 50];
        game.update();
        assert.strictEqual(game.players['player1'].score, 1);
        assert.strictEqual(game.players['player2'].score, 0);

        // Score a goal for player 2
        game.ball = [0, 50];
        game.update();
        assert.strictEqual(game.players['player1'].score, 1);
        assert.strictEqual(game.players['player2'].score, 1);
      });

      it('should update ball position and velocity correctly', () => {
        const game = new Game('player1', 'Player 1', 'player2', 'Player 2');

        // Move ball to hit the top wall
        game.ball = [50, 0];
        game.ball_velocity = [1, 1]; // Assuming MAX_SPEED is 1.5
        game.update();
        assert.strictEqual(game.ball[1], 1);
        assert.strictEqual(game.ball_velocity[1] > 0, true);

        // Move ball to hit the bottom wall
        game.ball = [50, 100];
        game.ball_velocity = [1, -1];
        game.update();
        assert.strictEqual(game.ball[1], 99);
        assert.strictEqual(game.ball_velocity[1] < 0, true);
      });

      it('should update ball position and velocity correctly when hitting players', () => {
        const game = new Game('player1', 'Player 1', 'player2', 'Player 2');

        // Move ball to hit player 2
        game.ball = [95, 50];
        game.update();
        assert.strictEqual(game.ball[0], 94);
        // Add more assertions based on your logic for ball-player collisions

        // Move ball to hit player 1
        game.ball = [5, 50];
        game.update();
        assert.strictEqual(game.ball[0], 6);
        // Add more assertions based on your logic for ball-player collisions
      });
    });

    describe('Game Reset', () => {
      it('should reset the ball position and velocity correctly for player 1', () => {
        const game = new Game('player1', 'Player 1', 'player2', 'Player 2');

        // Score a goal for player 1 and reset
        game.ball = [100, 50];
        game.update();
        game.reset(1);
        assert.deepStrictEqual(game.ball, [60, 50]);
        assert.deepStrictEqual(game.ball_velocity, [-1 / 3, 0]); // Assuming MIN_SPEED is 1
      });

      it('should reset the ball position and velocity correctly for player 2', () => {
        const game = new Game('player1', 'Player 1', 'player2', 'Player 2');

        // Score a goal for player 2 and reset
        game.ball = [0, 50];
        game.update();
        game.reset(2);
        assert.deepStrictEqual(game.ball, [40, 50]);
        assert.deepStrictEqual(game.ball_velocity, [1 / 3, 0]); // Assuming MIN_SPEED is 1
      });
    });
  });
});
