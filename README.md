#code challenge moobi

basic setup to express and mongo


# API REF

| Verbo http |            URL           | parâmetros |                             Descrição                             |                       "body"                       | Resposta |
|------------|:------------------------:|:----------:|:-----------------------------------------------------------------:|:--------------------------------------------------:|----------|
|     GET    | /api/consoles            |      -     | Lista de todos os video-games                                     |                          -                         |          |
|    POST    | /api/consoles            |      -     | Cria video-games                                                  |          { name: string, company: string }         |          |
|     GET    | /api/consoles/:consoleId | consoleId  | Detalhes do video-game, contendo todos os jogos                   |                          -                         |          |
|     PUT    | /api/consoles/:consoleId | consoleId  | Atualiza um video-game                                            |          { name: string, company: string }         |          |
|   DELETE   | /api/consoles/:consoleId | consoleId  | Deleta um video-game                                              |                          -                         |          |
|     GET    | /api/games               |      -     | Lista de todos os jogos                                           |                          -                         |          |
|    POST    | /api/games               |      -     | Cria Jogo                                                         | { name: string, consolesId: arrayOf([consoleId]) } |          |
|     GET    | /api/games/:gameId       |   gameId   | Detalhes do jogo, contendo todos os consoles para que foi lançado |                          -                         |          |
|     PUT    | /api/games/:gameId       |   gameId   | Atualiza um jogo                                                  |                  { name: string }                  |          |
|   DELETE   | /api/games/:gameId       |   gameId   | Deleta um jogo                                                    |                          -                         |          |
