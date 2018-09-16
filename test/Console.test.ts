import request from "supertest";
import app from "../src/app";

const data = { name: "Playstation 4", company: "Sony" };
const dataUpdated = {
  company: "Nintendo",
  name: "Nintendo Switch"
};
let console_id;
let console_name;
let game_id;

describe("API /api/consoles", () => {
  it("GET should return 200 OK and a list of consoles", done => {
    request(app)
      .get("/api/consoles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("data", []);
        done();
      });
  });

  it("POST should return 200 OK and create a console", done => {
    request(app)
      .post("/api/consoles")
      .send(data)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("name", data.name);
        expect(res.body.data).toHaveProperty("company", data.company);
        expect(res.body.data).toHaveProperty("id");

        console_id = res.body.data.id;
        console_name = res.body.data.name;
        done();
      });
  });

  it("POST should return 200 and error", done => {
    request(app)
      .post("/api/consoles")
      .send(data)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(false);
        expect(res.body.error.errmsg).toEqual(
          'E11000 duplicate key error collection: moobi-test.consoles index: name_1 dup key: { : "Playstation 4" }'
        );
        done();
      });
  });
});

describe("API /api/consoles/:consoleId", () => {
  it("GET should return 200 OK and a console details without any game", done => {
    request(app)
      .get(`/api/consoles/${console_id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("name");
        expect(res.body.data).toHaveProperty("company");
        expect(res.body.data.games[0]).toBe(undefined);

        done();
      });
  });

  it("GET should return 200 OK and a console details with all games", done => {
    const game = { name: "Marvel's Spider-Man", console_id, console_name };

    request(app)
      .post(`/api/games/`)
      .send(game)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        game_id = res.body.data.id;
        if (err) return done(err);

        request(app)
          .get(`/api/consoles/${console_id}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty("name", data.name);
            expect(res.body.data).toHaveProperty("company", data.company);
            expect(res.body.data).toHaveProperty("id", console_id);
            expect(res.body.data.games[0]).toHaveProperty("id", game_id);
            expect(res.body.data.games[0]).toHaveProperty("name", game.name);
            expect(res.body.data.games[0]).toHaveProperty(
              "console_id",
              console_id
            );
            expect(res.body.data.games[0]).toHaveProperty(
              "console_name",
              console_name
            );

            done();
          });
      });
  });

  it("PUT should return 200 OK with updated console data", done => {
    request(app)
      .put(`/api/consoles/${console_id}`)
      .send(dataUpdated)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("name", dataUpdated.name);
        expect(res.body.data).toHaveProperty("company", dataUpdated.company);
        expect(res.body.data).toHaveProperty("id");

        done();
      });
  });

  it("DELETE should return 200 OK with console data", done => {
    request(app)
      .delete(`/api/consoles/${console_id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("name", dataUpdated.name);
        expect(res.body.data).toHaveProperty("company", dataUpdated.company);
        expect(res.body.data).toHaveProperty("id");
        done();
      });
  });

  it("expection: 'delete game created to test'", done => {
    request(app)
      .delete(`/api/games/${game_id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).toBe(true);
        done();
      });
  });

  it("GET should return 404 not found", done => {
    request(app)
      .get(`/api/consoles/${console_id}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("PUT should return 404 not found", done => {
    request(app)
      .put(`/api/consoles/${console_id}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("DELETE should return 404 not found", done => {
    request(app)
      .delete(`/api/consoles/${console_id}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
