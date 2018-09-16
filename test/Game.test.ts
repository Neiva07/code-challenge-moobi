import request from "supertest";
import app from "../src/app";

const data = { name: "XBOX ONE", company: "Microsoft Corporation" };
const game = { name: "Fifa 19" };
const gameUpdated = { name: "Fifa 20" };

let consoleId;
let gameId;

describe("API /api/games", () => {
  it("GET should return 200 OK without data", done => {
    request(app)
      .get("/api/games")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual([]);
        done();
      });
  });

  it("POST should return 200 OK", done => {
    // since we need a console to create a game...
    request(app)
      .post("/api/consoles")
      .send(data)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        consoleId = res.body._id;
        const newGame = { ...game, consolesId: [consoleId] };
        request(app)
          .post("/api/games")
          .send(newGame)
          .set("Accept", "application/json")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.body).toHaveProperty("updatedAt");
            expect(res.body).toHaveProperty("createdAt");
            expect(res.body).toHaveProperty("name", game.name);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("consoles", [consoleId]);

            gameId = res.body._id;
            done();
          });
      });
  });

  it("POST should return 422 Unprocessable Entity", done => {
    const newGame = { ...game, consolesId: [consoleId] };
    request(app)
      .post("/api/games")
      .send(newGame)
      .set("Accept", "application/json")
      .expect(422)
      .end((err, res) => {
        expect(res.body.err).toBe(
          'E11000 duplicate key error collection: moobi-test.games index: name_1 dup key: { : "Fifa 19" }'
        );
        done();
      });
  });

  it("POST should return 406 Not Acceptable", done => {
    const newGame = { ...game };
    request(app)
      .post("/api/games")
      .send(newGame)
      .set("Accept", "application/json")
      .expect(406)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.err).toBe("consolesId is a required field");

        done();
      });
  });

  it("POST should return 406 Not Acceptable", done => {
    const newGame = { ...game, consolesId: ["5b9e6456300dba62abf8f0ec"] };
    request(app)
      .post("/api/games")
      .send(newGame)
      .set("Accept", "application/json")
      .expect(406)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.err).toBe("one or more console ids not found");

        done();
      });
  });

  it("GET should return 200 OK with data", done => {
    const newGame = { ...game, consoles: [consoleId] };
    request(app)
      .get("/api/games")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.arrayContaining([expect.objectContaining(newGame)])
        );
        done();
      });
  });
});

describe("API /api/games/:gameId", () => {
  it("GET should return 200 OK with consoles data", done => {
    request(app)
      .get(`/api/games/${gameId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("name", game.name);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.consoles[0]).toHaveProperty("updatedAt");
        expect(res.body.consoles[0]).toHaveProperty("createdAt");
        expect(res.body.consoles[0]).toHaveProperty("name", data.name);
        expect(res.body.consoles[0]).toHaveProperty("company", data.company);
        expect(res.body.consoles[0]).toHaveProperty("_id");
        expect(res.body.consoles[0]).toHaveProperty("games", [gameId]);
        done();
      });
  });

  it("PUT should return 200 OK", done => {
    request(app)
      .put(`/api/games/${gameId}`)
      .send(gameUpdated)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("name", gameUpdated.name);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("consoles", [consoleId]);
        done();
      });
  });

  it("DELETE should return 200 OK", done => {
    request(app)
      .delete(`/api/games/${gameId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("name", gameUpdated.name);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("consoles", [consoleId]);
        done();
      });
  });

  it("GET should return 400 Not Found", done => {
    request(app)
      .get(`/api/games/${gameId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("PUT should return 400 Not Found", done => {
    request(app)
      .put(`/api/games/${gameId}`)
      .send(gameUpdated)
      .set("Accept", "application/json")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("DELETE should return 400 Not Found", done => {
    request(app)
      .delete(`/api/games/${gameId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
