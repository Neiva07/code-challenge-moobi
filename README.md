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


# code coverage
![code coverage](https://user-images.githubusercontent.com/11433064/45598393-b6ade600-b9b1-11e8-8bf2-efaa1c2ab156.png)

I have some problems if git, I could't upload my changes to github, so I decided to backup the project and copy all, then remove the .git folder and initialize git again to upload.

below has the tree, I still can show to you with my computer (only :()
![tree](https://user-images.githubusercontent.com/11433064/45598392-b6ade600-b9b1-11e8-8a4f-802ee0a290c4.png)
