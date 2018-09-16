import request from "supertest";
import app from "../src/app";

const data = { name: "Playstation 4", company: "Sony" };
const dataUpdated = {
  company: "Nintendo",
  name: "Nintendo Switch"
};
let consoleId;
let gameId;

describe("API /api/consoles", () => {
  it("GET should return 200 OK without data", done => {
    request(app)
      .get("/api/consoles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual([]);
        done();
      });
  });

  it("POST should return 200 OK", done => {
    request(app)
      .post("/api/consoles")
      .send(data)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("name", data.name);
        expect(res.body).toHaveProperty("company", data.company);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("games", []);

        consoleId = res.body._id;
        done();
      });
  });

  it("POST should return 422 Unprocessable Entity", done => {
    request(app)
      .post("/api/consoles")
      .send(data)
      .set("Accept", "application/json")
      .expect(422)
      .end((err, res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toHaveProperty("code", 11000);
        expect(res.body.message).toHaveProperty(
          "errmsg",
          'E11000 duplicate key error collection: moobi-test.consoles index: name_1 dup key: { : "Playstation 4" }'
        );
        done();
      });
  });

  it("GET should return 200 OK with data", done => {
    request(app)
      .get("/api/consoles")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual(
          expect.arrayContaining([expect.objectContaining(data)])
        );
        done();
      });
  });
});

describe("API /api/consoles/:consoleId", () => {
  it("GET should return 200 OK with no games", done => {
    request(app)
      .get(`/api/consoles/${consoleId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("name", data.name);
        expect(res.body).toHaveProperty("company", data.company);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("games", []);
        done();
      });
  });

  it("GET should return 200 OK with games populated", done => {
    const game = { name: "Marvel's Spider-Man", consolesId: [consoleId] };

    request(app)
      .post(`/api/games/`)
      .send(game)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        gameId = res.body._id;
        if (err) return done(err);

        request(app)
          .get(`/api/consoles/${consoleId}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.body).toHaveProperty("updatedAt");
            expect(res.body).toHaveProperty("createdAt");
            expect(res.body).toHaveProperty("name", data.name);
            expect(res.body).toHaveProperty("company", data.company);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty(
              "games",
              expect.arrayContaining([
                expect.objectContaining({ name: game.name })
              ])
            );
            done();
          });
      });
  });

  it("PUT should return 200 OK with games id", done => {
    request(app)
      .put(`/api/consoles/${consoleId}`)
      .send(dataUpdated)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("name", dataUpdated.name);
        expect(res.body).toHaveProperty("company", dataUpdated.company);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("games", [gameId]);
        done();
      });
  });

  it("DELETE should return 200 OK with games id", done => {
    request(app)
      .delete(`/api/consoles/${consoleId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("name", dataUpdated.name);
        expect(res.body).toHaveProperty("company", dataUpdated.company);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("games", [gameId]);
        done();
      });
  });

  it("expection: 'delete game created to test'", done => {
    request(app)
      .delete(`/api/games/${gameId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("updatedAt");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("name", "Marvel's Spider-Man");
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("consoles", [consoleId]);
        done();
      });
  });

  it("GET should return 404 not found", done => {
    request(app)
      .get(`/api/consoles/${consoleId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("PUT should return 404 not found", done => {
    request(app)
      .put(`/api/consoles/${consoleId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("DELETE should return 404 not found", done => {
    request(app)
      .delete(`/api/consoles/${consoleId}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
