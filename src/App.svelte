<script>
  // @ts-nocheck

  import GameBoard from "./lib/GameBoard.svelte";
  import * as g from "./lib/Game";
  import { onMount } from "svelte";

  import * as tmi from "tmi.js";

  const CMD_JOIN_GAME = "!tb-join";
  const CMD_NEW_GAME = "!tb-new";
  const CMD_START_GAME = "!tb-start";
  const CMD_PLACE_BLOCK = "!tb";

  //convience arr
  const CMD_ALL = [
    CMD_JOIN_GAME,
    CMD_NEW_GAME,
    CMD_START_GAME,
    CMD_PLACE_BLOCK,
  ];

  //Game States
  const GS_CREATED = "GS_CREATED";
  const GS_READY = "GS_READY";
  const GS_STARTED = "GS_STARTED";
  const GS_DONE = "GS_DONE";

  
  const FILL_TYPE_MIXED = "MIXED";

  /*********************************************************/
  /* Game Instance(s) & Defaults
  /*********************************************************/

  let gameOptionsDefault = {
    maxPlayers: 2,
    roundCount: 1,
    gridSize: 3,
    twitchChannel: "",
    preFillCount: 7,
  };

  //$: tmiClient = false;
  $: connStatus = false;
  $: gInstance = {};


  const shuffledArr = (arr) => {
    if (arr.length === 1) {
      return arr;
    }
    const rand = Math.floor(Math.random() * arr.length);
    return [arr[rand], ...shuffledArr(arr.filter((_, i) => i != rand))];
  };

  const makeEmptyGrid = (gsize) => {
    return new Array(gsize * gsize).fill(0);
  };


  const fillGrid = (gridSize) => {
    let agrid = new Array(gridSize * gridSize).fill(0);

    let filledArray = agrid.map(function () {
      return Math.floor(Math.random() * 11) + 1;
    });

    //force some empty slots
    const r1 = Math.floor(Math.random() * (gridSize * gridSize));
    filledArray[r1] = 1;

    const r2 = Math.floor(Math.random() * (gridSize * gridSize));
    filledArray[r2] = 2;

    //force some easier color options
    const r3 = Math.floor(Math.random() * (gridSize * gridSize));
    filledArray[r3] = 3;

    return shuffledArr(filledArray);
  };

  const makeNewGame = (gridSize, fillType) => {
    return {
      state: GS_CREATED,
      playerWon: false,

      timeCreated: new Date().toLocaleTimeString(),

      fillType: fillType,
      gridSize: gridSize,

      options: gameOptionsDefault,

      mainGameBoard: makeNewGameBoard(gridSize, 0),
      playerGB: new Array(),
      leaderBoard: new Array(),

      sortAndFindWinner() {
        this.leaderBoard = [
          ...this.playerGB.map(({ player, score }) => ({ player, score })),
        ].sort((a, b) => b.score - a.score);

        if (this.leaderBoard[0].score >= gridSize * gridSize) {
          this.playerWon = this.leaderBoard[0];
          

          this.state = GS_DONE;
        }
      },
    };
  };

  const makeNewPlayer = (username, id, avt) => {
    return {
      username: username,
      id: id,
      avt: avt,
    };
  };

  const makeNewGameBoard = (gridSize, player) => {
    return {
      player: player,
      gridSize: gridSize,
      score: 0,
      maxScore: gridSize * gridSize,

      grid: makeEmptyGrid(gridSize),
      gridCorrect: makeEmptyGrid(gridSize),

      rotation: g.ROT_0,

      colorBlocks: [1, 2, 3],
      colorIdx: Math.floor(Math.random() * 3) + 1,

      clockBlocksA: [4, 5, 6, 7],
      clockBlocksB: [8, 9, 10, 11],

      clockIdxA: Math.floor(Math.random() * 3) + 1,
      clockIdxB: Math.floor(Math.random() * 3) + 1,

      updateBlocksIdx() {
        if (this.colorIdx >= 3) {
          this.colorIdx = 1;
        } else {
          this.colorIdx++;
        }

        if (this.clockIdxA >= 3) {
          this.clockIdxA = 0;
        } else {
          this.clockIdxA++;
        }

        if (this.clockIdxB >= 3) {
          this.clockIdxB = 0;
        } else {
          this.clockIdxB++;
        }
      },

      findValueOfPaintBlockPicker(pBlock) {
        switch (pBlock) {
          case "Q": {
            return this.colorIdx;
          }

          case "W": {
            return this.clockIdxA + g.BT_CLOCK_A_MIN;
          }

          case "E": {
            return this.clockIdxB + g.BT_CLOCK_B_MIN;
          }
        }
      },

      scoreGameBoard() {
        this.score = 0;
        for (let x = 0; x < this.grid.length; x++) {
          if (this.grid[x] == this.gridCorrect[x]) {
            if (this.gridCorrect[x] > 0) {
              this.score++;
            }
          }
        }
      },

      removeBadGuess() {
        for (let x = 0; x < this.grid.length; x++) {
          if (this.grid[x] != this.gridCorrect[x]) {
            this.grid[x] = 0;
          }
        }
        this.grid = [...this.grid];
      },
    };
  };

  /*********************************************************/
  /* Commands
  /*********************************************************/
  const cmdNewGame = () => {
    gInstance = makeNewGame(3, FILL_TYPE_MIXED);
  };

  const cmdStartGame = () => {
    if (
      gInstance.state != GS_CREATED ||
      (gInstance.state == GS_CREATED && gInstance.playerGB.length < 1)
    ) {
      console.log(
        "cmdStartGame:Cant Start Game, Wrong State:",
        gInstance.state
      );
      return false;
    }

    gInstance.mainGameBoard.grid = fillGrid(gInstance.gridSize);

    //setup rotation for each playerboard, either +90 or -90
    let lastRot = g.ROT_90;
    gInstance.playerGB.forEach((x) => {
      x.rotation = lastRot;

      for (let gi = 0; gi < x.grid.length; gi++) {
        let mainGBVal = gInstance.mainGameBoard.grid[gi];

        let correctLocIdx = g.getNewIndexForARotation(gi, x.rotation);
        let correctVal = g.getNewValForRotation(mainGBVal, x.rotation);
        x.gridCorrect[correctLocIdx] = correctVal;

        if (gi < gInstance.options.preFillCount) {
          x.grid[correctLocIdx] = correctVal;
        }
      }
      //for pre-fill testing and getting name on leaderboard
      x.scoreGameBoard();

      if (lastRot == g.ROT_90) {
        lastRot = g.ROT_270;
      }
    });

    gInstance.sortAndFindWinner();

    //start the blockPickerTickers ()
    gInstance.intervalFD = setInterval(function () {
      if (gInstance.state == GS_STARTED) {
        gInstance.playerGB.forEach((x) => {
          x.updateBlocksIdx();
        });

        //svelte-reactive-hack
        gInstance = gInstance;
      }
    }, 2000);

    gInstance.state = GS_STARTED;
    return true;
  };

  const cmdJoinGame = (username, userid) => {
    if (gInstance.state != GS_CREATED) {
      console.log("Can't Join Game Now:" + gInstance.state);
      return false;
    }

    if (gInstance.playerGB.find((gb) => gb.player.id === username)) {
      console.log("Player Already Joined:" + username);
      return false;
    }

    if (gInstance.playerGB.length >= gInstance.options.maxPlayers) {
      console.log("Max Players Reached");
      return false;
    }

    let newPlayer = makeNewPlayer(username, username, "none");
    let newGameBoard = makeNewGameBoard(gInstance.gridSize, newPlayer);

    gInstance.playerGB.push(newGameBoard);
    gInstance.playerGB = [...gInstance.playerGB];

    if (gInstance.playerGB.length == gInstance.options.maxPlayers) {
      gInstance.state = GS_READY;
    }

    gInstance.sortAndFindWinner();
    return true;
  };

  const cmdPlaceBlock = (username, args, ts) => {
    if (!args.length || gInstance.state != GS_STARTED) {
      console.log("cmdPlaceBlock:invalid state");
      return false;
    }

    let cmdTxt = args[0].toUpperCase().trim();
    let parsedParts = g.parsePlaceBlock(gInstance.gridSize, cmdTxt);

    if (parsedParts === false) {
      console.log("invalid cmd");
      return false;
    }
    
    /*
    console.log("=======");
    console.log(parsedParts.col);
    console.log(parsedParts.row);
    console.log(parsedParts.pb);
    console.log(parsedParts.idx);
    console.log("=======");*/

    let aPlayerGB = gInstance.playerGB.find((gb) => gb.player.id === username);

    if (!aPlayerGB) {
      console.log("player not found:", username);
      return false;
    }

    let guessValue = aPlayerGB.findValueOfPaintBlockPicker(parsedParts.pb);

    aPlayerGB.grid[parsedParts.idx] = guessValue;

    aPlayerGB.scoreGameBoard();
    gInstance.sortAndFindWinner();

    setTimeout(function () {
      aPlayerGB.removeBadGuess();
    }, 1000);

    gInstance = gInstance;
  };



  /*********************************************************/
  /* TESTING / DEBUG
  /*********************************************************/

  let TESTING = false;



  /*********************************************************/
  /* Svelte (MOUNT)
  /*********************************************************/
  onMount(async () => {
    gInstance = makeNewGame(gameOptionsDefault.gridSize, FILL_TYPE_MIXED);
    
  });

  async function twitchTMIConnect() {
    if (gameOptionsDefault.twitchChannel == "") {
      console.log("TConnect: No Twitch Channel Name");
      return;
    }

    const client = new tmi.Client({
      options: { debug: true },
      channels: [gameOptionsDefault.twitchChannel],
    });

    client.connect().catch(console.error);

    client.on("connected", (...args) => {
      connStatus = true;
    });
    client.on("error", (...args) => {
      connStatus = false;
    });

    client.on("message", (channel, tags, message, self) => {
      if (self) return;

      let userId = tags["user-id"];
      let username = tags.username;
      let sendTS = tags["tmi-sent-ts"];
      let procTS = Date.now();

      let msg = message;
      let isMod = tags["mod"];
      

      let isBroadcaster = tags["badges"] && tags["badges"].broadcaster;
      

      msgHandler(username, userId, isMod, isBroadcaster, procTS - sendTS, msg);

      /*console.log(tags);
      console.log(message);
      console.log(channel);
      console.log("========");
      console.log(userId);
      console.log(username);
      console.log(sendTS);
      console.log(procTS);
      console.log(msg);
      console.log(isBroadcaster);
      console.log(isMod);*/
    });
  }
  const procCmd = (cmdname, args, username, tsDiff, IsMod, IsBroadcaster) => {
    switch (cmdname) {
      case CMD_JOIN_GAME: {
        cmdJoinGame(username, username);
        break;
      }

      case CMD_START_GAME: {
        cmdStartGame();
        break;
      }

      case CMD_NEW_GAME: {
        console.log("CMD:NEW-GAME");
        if (IsMod || IsBroadcaster) {
          cmdNewGame();
        } else {
          console.log("Need To Be Mod Or Broadcaster for New Game");
        }

        break;
      }

      case CMD_PLACE_BLOCK: {
        console.log("Cmd:CmdPlaceBlock");
        cmdPlaceBlock(username, args, tsDiff);

        break;
      }

      default: {        
        break;
      }
    } //end-switch
  };

  const msgHandler = (username, userID, IsMod, IsBroadcaster, tsDiff, msg) => {
    console.log("User:", username, ",msg:", msg, ",TS:", tsDiff);

    const cleanMsg = msg
      .replace(/[\t\s]{2,}/g, " ")
      .toLowerCase()
      .trim();

    const parsedCmdParts = cleanMsg.split(" ");
    if (parsedCmdParts.length < 1) {
      return;
    }

    const cmdName = parsedCmdParts.shift();
    const cmdArgs = parsedCmdParts;

    console.log("cmdName:", cmdName);
    console.log(cmdArgs);
    

    if (CMD_ALL.some((x) => x === cmdName)) {
      console.log("--->WILL PROC CMD:",cmdName);
      procCmd(cmdName, cmdArgs, username, tsDiff, IsMod, IsBroadcaster);
    } else {
      console.log("--->CMD NOT OURS");
    }
  };
</script>

{#if gInstance && gInstance.playerGB}
  <main style="max-width:1400px;" class="mx-auto p-2 m-1">
    <div class="row">
      <div class="col-12 text-center p-2 bg-primary text-white">
        <h1 class="fnt2">TimeBLOCKS</h1>
      </div>
      <div class="col-12 text-center p-2 bg-dark text-white">
        <h4 class="text-center p-2">
          <strong class="text-danger"> RECREATE </strong>

          The Main Board With The Correct
          <strong class="text-danger">ROTATION</strong>
        </h4>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-12">&nbsp;</div>

      <div class="col-12 col-md-3 p-2">
        <div
          class="bg-light rounded p-2 text-light input-group-sm border border-secondary"
        >
          <h6 class="text-center font-monospace text-dark text-uppercase">
            Config
          </h6>
          <table class="table table-sm table-bordered font-monospace">
            <tr>
              <td class="text-dark w-50"> T.Channel </td>

              <td>
                <input
                  type="text"
                  class="form-control input-sml input-group-sm"
                  bind:value={gameOptionsDefault.twitchChannel}
                />
              </td>
            </tr>

            <tr>
              <td class="text-dark w-50">Max Players</td>

              <td>
                <input
                  type="number"
                  class="form-control input-sml input-group-sm"
                  bind:value={gameOptionsDefault.maxPlayers}
                />
              </td>
            </tr>

            <tr>
              <td class="text-danger w-50">Prefill {gameOptionsDefault.preFillCount} / {gameOptionsDefault.gridSize*gameOptionsDefault.gridSize}  </td>

              <td>
                <input
                  type="number"
                  min=0
                  class="form-control input-sml input-group-sm"
                  bind:value={gameOptionsDefault.preFillCount}
                />
              </td>
            </tr>
          </table>
        </div>
        <p>&nbsp;</p>

        <div
          class="bg-light rounded p-2 text-light input-group-sm border border-secondary"
        >
          <h6 class="text-center font-monospace text-dark text-uppercase">
            Game
          </h6>
          <table class="table table-sm table-bordered font-monospace">
            <tr>
              <td class="text-dark w-50">Status</td>

              <td>
                <span class="">{gInstance ? gInstance.state : "None"}</span>
              </td>
            </tr>

            <tr>
              <td class="text-dark w-50">Players</td>

              <td>
                <span class="">{gInstance ? gInstance.playerGB.length : 0}</span
                >
              </td>
            </tr>

            <tr>
              <td class="text-dark w-50">Created TS</td>

              <td
                >connStatus
                <span class="">{gInstance ? gInstance.timeCreated : ""}</span>
              </td>
            </tr>
          </table>
        </div>

        <p>&nbsp;</p>

        <div class="col-12 text-center p-1 d-flex justify-content-evenly">
          <button
            class="btn btn-primary btn-sm"
            disabled={gameOptionsDefault.twitchChannel == ""}
            on:click={twitchTMIConnect}>Twitch Connect</button
          >
          <small> {connStatus ? "Connected" : "Not Connected"}</small>
        </div>

        <div class="col-12 text-center p-1 d-flex justify-content-evenly">
          <button
            class="btn btn-primary btn-sm"
            disabled={!connStatus}
            on:click={cmdNewGame}>New Game</button
          >
          <button
            on:click={cmdStartGame}
            class="btn btn-primary btn-sm"
            disabled={!gInstance ||
              (gInstance.state == GS_CREATED && gInstance.playerGB.length < 1)}
            >Start Game</button
          >
        </div>
      </div>

      <div class="col-12 col-md-6 p-2 ps-3 pe-3">
        <GameBoard
          gameBoard={gInstance.mainGameBoard}
          leaderBoard={gInstance.leaderBoard}
        />
      </div>

      <div class="col-12 col-md-3 p-2 ps-3 pe-3">
        <div class="rounded border border-dark bg-light p-1">
          <h5 class="text-center fnt2">COMMANDS</h5>
          <ul class="text-small">
            <li class="pb-1 pt-1">
              <strong class="text-danger">!tb-new</strong>: Create a new game,
              that players may join.
            </li>
            <li class="pb-1 pt-1">
              <strong class="text-danger">!tb-start</strong>: Once there is at
              least one player you may manually start the game.
            </li>
            <li class="pb-1 pt-1">
              <strong class="text-danger">!tb-join</strong>: Join the game.
            </li>

            <li class="pb-1 pt-1">
              <strong class="text-danger">!tb [col,row,block] </strong>: Place a
              block. Examples below:

              <br />
              <br />

              <small>
                <strong class="text-success"> !tb A1Q: </strong> Column A, Row 1
                and a COLOR Block

                <br />
                <strong class="text-success"> !tb B2W: </strong> Column B, Row 2
                and a CLOCK-A Block

                <br />
                <strong class="text-success"> !tb B3E: </strong> Column B, Row 3
                and a CLOCK-B Block
              </small>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <hr />
    

    {#if (gInstance.state == GS_DONE && gInstance.leaderBoard.length > 0)}
    <h1 class="text-center text-danger">
      PLAYER: {gInstance.leaderBoard[0].player.username} WON !!
    </h1>
    {:else}
      <h1 class="text-center fnt2">PLAYERS</h1>
    {/if}

    <h3
      class="{gInstance.playerGB.length
        ? 'd-none'
        : 'd-block'} text-center text-danger"
    >
      Waiting For Players To Join...
    </h3>

    <div class="row m-0 p-0">
      {#each gInstance.playerGB as pgb}
        <div class="col-6 p-4">
          <GameBoard
            gameBoard={pgb}
            player={pgb.player}
            colorIdx={pgb.colorIdx}
            clockIdx={pgb.clockIdx}
            leaderBoard="[]"
          />
        </div>
      {/each}
    </div>
  </main>
{/if}

<style>
</style>
