<script>
    import { mathMod } from "ramda";
    import * as g from "./Game";
    import { afterUpdate } from "svelte";

    let divRef;

    export let idx;
    export let val = 0;
    export let rotx;

    export let cval = 0;
    export let isPlayer = false;

    let color_lookup = ["bg-primary2", "bg-info", "bg-success", "bg-danger"];
    let clock_a_lookup = [
        "clockA0.png",
        "clockA1.png",
        "clockA2.png",
        "clockA3.png",
    ];
    let clock_b_lookup = [
        "clockB0.png",
        "clockB1.png",
        "clockB2.png",
        "clockB3.png",
    ];

    $: borderValue =
        val != cval && val != 0 && isPlayer
            ? " cube-val-not-ok shake p-0 "
            : "  bounceIn  ";

    $: cubeSpinDo =
        val != 0 && isPlayer
            ? " cube-spin-" + Math.floor(Math.random() * 3 + 1) + " "
            : " ";

    const get_class = (val) => {
        if (val > 3) {
            return color_lookup[0];
        }

        return color_lookup[val];
    };

    const get_img = (val) => {
        const prefix = "/img/";
        if (val >= 4 && val < 8) {
            return prefix + clock_a_lookup[val - 4];
        } else if (val >= 8 && val < 12) {
            return prefix + clock_b_lookup[val - 8];
        }

        return "";
    };

    const handleAnimationEnd = () => {
        setTimeout(function () {
            divRef.classList.remove("shake");
            divRef.classList.remove("bounceIn");
            divRef.classList.remove("ccube-val-not-ok");

            divRef.classList.remove("cube-spin-3");
            divRef.classList.remove("cube-spin-2");
            divRef.classList.remove("cube-spin-1");
        }, 750);
    };
</script>

<div
    class=" p-1 pt-2 pb-2 m-2 text-center"
    on:animationend={handleAnimationEnd}
>
    <div class="container-cubes text-center {borderValue}  " bind:this={divRef}>
        {#if idx == 0 || idx == 3 || idx == 6}
            <h5 class="p-1 pt-0 m-0 text-light fnt2 row-idx">{idx / 3 + 1}</h5>
        {/if}

        <div class="cube p-0 m-0 {cubeSpinDo}  ">
            <div
                class="p-0 m-0 face {get_class(
                    val
                )} front d-flex align-items-center justify-content-center text-center center align-middle align-middle h-100"
            >
                <span class="text-info {val == 0 ? 'd-inline' : 'd-none'}">
                    <small> Empty </small>
                </span>
                <div
                    class="d-none p-0 m-0"
                    style="position:absolute; top:0px;left:0px;"
                >
                    <small>
                        <p class="p-0 m-0">I:{idx}||V:{val}||R:{rotx}</p>
                        <p class="p-0 m-0">
                            LROT:{g.getNewIndexForARotation(idx, rotx)}
                        </p>
                        <p>IROT:{g.getNewValForRotation(val, rotx)}</p>
                        <p class="text-dark">CC[{cval}]</p>
                    </small>
                </div>

                {#if val > 3}
                    <div class="p-2 bg-white">
                        <img src={get_img(val)} class="img-fluid img" />
                    </div>
                {/if}

                <!-- 
            <img
                src={get_img(g.getNewValForRotation(val, rotx))}
                class=" d-none  border border-danger bg-danger img-fluid p-0"
            /> -->
            </div>
            <div class="face back bg-success rounded" />
            <div class="face right bg-danger rounded" />
            <div class="face left bg-warning rounded" />
            <div class="face top bg-primary rounded" />
            <div class="face bottom bg-secondary rounded" />
        </div>
    </div>
</div>

<style>
    .bg-primary2 {
        background-color: #0d6efdbb;
    }

    .cube-val-not-ok {
        border: 8px solid #dd0000 !important;
        border-radius: 0px;
    }

    .cube-val-ok {
        border: 8px solid #0ee000 !important;
        border-radius: 4px;
    }

    .row-idx {
        position: absolute;
        left: -20px;
        top: 32px;
    }

    :root {
        --transZ: 40px;
    }

    .container-cubes {
        width: 80px;
        height: 80px;
        perspective: 1000px;
        margin: 0px auto 0;
        padding: 0px;
    }
    .cube-spin-1 {
        animation: spin-z 0.4s ease-out;
        animation-iteration-count: 1;
    }

    .cube-spin-2 {
        animation: spin-z 0.4s ease-out;
        animation-iteration-count: 1;
    }

    .cube-spin-3 {
        animation: spin-z 0.4s ease-out;
        animation-iteration-count: 1;
    }
    .cube {
        transform-style: preserve-3d;
        width: 100%;
        height: 100%;
        position: relative;

        padding: 0px;
        margin: 0px;
    }
    .face {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .top {
        transform: rotateX(90deg) translateZ(var(--transZ));
        border: 0px solid #333;
        border-radius: 4px;
    }
    .bottom {
        transform: rotateX(-90deg) translateZ(var(--transZ));
        border: 0px solid #333;
        border-radius: 4px;
    }

    .right {
        transform: rotateY(90deg) translateZ(var(--transZ));
    }
    .left {
        transform: rotateY(-90deg) translateZ(var(--transZ));
    }

    .front {
        transform: rotateX(0deg) translateZ(var(--transZ));
        border: 2px solid #020e4d;
        border-radius: 4px !important;
    }
    .back {
        transform: rotateX(-180deg) translatanimeZ(var(--transZ));
        border: 0px solid #333;
    }

    @keyframes spin-x {
        from {
            transform: rotateX(0deg);
        }
        to {
            transform: rotateX(360deg);
        }
    }

    @keyframes spin-y {
        from {
            transform: rotateY(0deg);
        }
        to {
            transform: rotateY(360deg);
        }
    }

    @keyframes spin-z {
        from {
            transform: rotateZ(0deg);
        }
        to {
            transform: rotateZ(360deg);
        }
    }
</style>
