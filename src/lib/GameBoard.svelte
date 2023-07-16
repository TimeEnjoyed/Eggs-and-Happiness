<script>
    import * as g from "./Game.js";

    import Cube from "./Cube.svelte";
    import BlockPicker from "./BlockPicker.svelte";
    import ClockPicker from "./ClockPicker.svelte";

    export let gameBoard;
    export let player;

    export let leaderBoard = [];
    export let col_lookup = ["A", "B", "C", "D", "E"];
</script>

{#if player}
    <div class="row pb-2 rounded">
        <div class="bg-dark text-light rounded p-2">
            <h3 class="fnt2 text-center">{player.username}</h3>

            <div class="w-100 d-flex d-flex justify-content-between p-0">
                <h5 class="text-center font-weight-bold">
                    ROTATION:
                    
                    <span class="{(gameBoard.rotation == g.ROT_90) ? "text-danger" : "text-success" }"> { (gameBoard.rotation == g.ROT_90) ? "CLOCKWISE (90deg) ": "ANTI-CLOCKWISE (-90deg)" } </span>
                </h5>

                <h5 class="text-center font-weight-bold">
                    SCORE: {gameBoard.score}
                </h5>
            </div>
        </div>
    </div>
{/if}

<div class="row p-2 rounded border-dark border bg-primary">
    <div class="col-8 pe-4">
        <div class="text-center">
            {#if player}
                <div class="d-none bg-dark text-light rounded p-2">
                    <h4 class="text-center">{player.username}</h4>

                    <div
                        class="w-100 d-flex d-flex justify-content-between p-0"
                    >
                        <h6 class="text-center font-weight-bold">
                            Rotation: Clockwise (90deg)
                        </h6>

                        <h6 class="text-center font-weight-bold">
                            SCORE: {gameBoard.score}
                        </h6>
                    </div>
                </div>
            {:else}
                <h2 class="fnt2 text-white">MAIN BOARD</h2>
            {/if}

            <div
                class="row {gameBoard.gridSize == 3
                    ? 'row-cols-3 '
                    : 'row-cols-4'} "
            >
                {#each gameBoard.grid as block, i}
                    <div class="col p-0 m-0">
                        {#if i < 3}
                            <h5
                                class="fnt2 p-0 pt-2 m-0 text-light text-weight-bolder"
                            >
                                {col_lookup[i]}
                            </h5>
                        {/if}

                        <Cube
                            idx={i}
                            val={block}
                            rotx={gameBoard.rotation}
                            isPlayer={player ? true : false}
                            cval={gameBoard.gridCorrect[i]}
                        />
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div
        class="col-4 bg-dark text-light p-2 border-secondary border rounded p-0 text-center d-flex d-flex justify-content-between flex-column"
    >
        {#if player}
            <div class="">
                <h6 class="p-0 m-0">[ Q ] COLOR</h6>
                <div class="pb-0">
                    <BlockPicker colorIdx={gameBoard.colorIdx} />
                </div>
                <hr />
            </div>

            <div class="pb-0">
                <h6 class="p-0 m-0">[ W ] CLOCK-A</h6>
                <ClockPicker clockIdx={gameBoard.clockIdxA} clockMode={"A"} />
                <hr />
            </div>

            <div class="pb-0">
                <h6 class="p-0 m-0">[ E ] CLOCK-B</h6>
                <ClockPicker clockIdx={gameBoard.clockIdxB} clockMode={"B"} />
            </div>
        {:else}
            <div class="bg-dark rounded-4 text-light shadow p12">
                <h5 class="fnt2">Leaderboard</h5>
                <div class="row text-light">
                    <div class="col-6">
                        NAME
                    </div>
                    <div class="col-6">
                        SCORE
                    </div>
                </div>

                {#each leaderBoard as lb}
                    <div class="row">
                        <div class="col-6">
                            <small>
                                {lb.player.username}
                            </small>
                        </div>

                        <div class="col-6">
                            <h5>
                                <span class="text-danger ">
                                  {lb.score} /  {gameBoard.maxScore}
                                </span>
                            </h5>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .bg-primary2 {
        background-color: #0d6efdbb !important;
    }
</style>
