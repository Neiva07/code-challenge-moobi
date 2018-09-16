import request from "supertest";
import app from "../src/app";
import { stringify } from "querystring";

const data = { name: "XBOX ONE", company: "Microsoft Corporation" };
const game = { name: "Fifa 19" };
const gameUpdated = { name: "Fifa 20" };

let console_id;
let console_name;
let game_id;

describe("API /api/games", () => {
  it("GET should return 200 OK without data", done => {
    request(app)
      .get("/api/games")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("data", []);
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
        console_id = res.body.data.id;
        console_name = res.body.data.name;
        const newGame = { ...game, console_id, console_name };

        request(app)
          .post("/api/games")
          .send(newGame)
          .set("Accept", "application/json")
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data).toHaveProperty("name", newGame.name);
            expect(res.body.data).toHaveProperty(
              "console_id",
              newGame.console_id
            );
            expect(res.body.data).toHaveProperty(
              "console_name",
              newGame.console_name
            );

            game_id = res.body.data.id;

            done();
          });
      });
  });

  it("POST should return 200", done => {
    const newGame = { ...game, consolesId: [console_id] };
    request(app)
      .post("/api/games")
      .send(newGame)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).toBe(false);
        expect(res.body.error.message).toBe(
          "Game validation failed: console_id: Path `console_id` is required., console_name: Path `console_name` is required."
        );
        done();
      });
  });

  it("GET should return 200 OK with data", done => {
    request(app)
      .get("/api/games")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        expect(res.body.data[0]).toHaveProperty("id");
        expect(res.body.data[0]).toHaveProperty("name", game.name);
        expect(res.body.data[0]).toHaveProperty("console_id", console_id);
        expect(res.body.data[0]).toHaveProperty("console_name", console_name);

        done();
      });
  });
});

describe("API /api/games/:game_id", () => {
  it("GET should return 200", done => {
    request(app)
      .get(`/api/games/${game_id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data).toHaveProperty("name");
        expect(res.body.data).toHaveProperty("console_id");
        expect(res.body.data).toHaveProperty("console_name");
        done();
      });
  });

  it("PUT should return 200 OK", done => {
    request(app)
      .put(`/api/games/${game_id}`)
      .send(gameUpdated)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data).toHaveProperty("name", gameUpdated.name);
        expect(res.body.data).toHaveProperty("console_id");
        expect(res.body.data).toHaveProperty("console_name");
        done();
      });
  });

  it("DELETE should return 200 OK", done => {
    request(app)
      .delete(`/api/games/${game_id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("name", gameUpdated.name);
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data).toHaveProperty("console_id", console_id);
        expect(res.body.data).toHaveProperty("console_name", console_name);
        done();
      });
  });

  it("GET should return 400 Not Found", done => {
    request(app)
      .get(`/api/games/${game_id}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("PUT should return 400 Not Found", done => {
    request(app)
      .put(`/api/games/${game_id}`)
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
      .delete(`/api/games/${game_id}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
