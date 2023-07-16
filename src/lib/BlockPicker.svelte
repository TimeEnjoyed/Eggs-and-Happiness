<script>
    import { onMount } from "svelte";
    export let colorIdx = 0;
    let color_lookup = ["bg-white", "bg-info", "bg-success", "bg-danger"];

    const get_class = (val) => {
        if (val > 3) {
            return color_lookup[0];
        }

        return color_lookup[val];
    };
</script>

<div class="container" style="transform:scale(0.6);">
    <div class="cube rounded  p-0 m-0 {'cube-spin-' + colorIdx}">
        <div
            class="p-0 m-0 face rounded {get_class(
                colorIdx
            )} front d-flex align-items-center justify-content-center text-center center align-middle align-middle h-100"
        >
            
        </div>
        <div class="face p-0 m-0 back bg-success rounded" />
        <div class="face right bg-danger rounded" />
        <div class="face left bg-warning rounded" />
        <div class="face top bg-primary rounded" />
        <div class="face bottom bg-secondary rounded" />
    </div>
</div>

<!-- 
<div class="row">
    {#each blocksInventory as b, i}
        <div class="col smallBlock {colorIdx == i ? '  smallBlock-active' : ''}">
            <div
                class=" {color_lookup[b]}  d-flex align-items-center justify-content-center text-center center align-middle align-middle h-100"
            >
                {b}||{i}
            </div>
        </div>
    {/each}
</div>
-->

<style>
    :root {
        --transZ: 40px;
    }

    .container {
        width: 80px;
        height: 80px;
        perspective: 1000px;
        margin: 0px auto 0;
        padding: 0px;
        
    }

    .cube-spin-1 {
        animation: spin-a 0.6s linear;
        animation-iteration-count: 1;
    }
    .cube-spin-2 {
        animation: spin-b 0.6s linear;
        animation-iteration-count: 1;
    }

    .cube-spin-3 {
        animation: spin-c 0.6s linear;
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
        border: 1px solid #333;
    }
    .bottom {
        transform: rotateX(-90deg) translateZ(var(--transZ));
        border: 1px solid #333;
    }

    .right {
        transform: rotateY(90deg) translateZ(var(--transZ));
    }
    .left {
        transform: rotateY(-90deg) translateZ(var(--transZ));
    }

    .front {
        transform: rotateX(0deg) translateZ(var(--transZ));
        border: 1px solid #333;
    }
    .back {
        transform: rotateX(-180deg) translatanimeZ(var(--transZ));
        border: 1px solid #333;
    }

    @keyframes spin-a {
        from {
            transform: rotateY(0deg) rotateZ(0deg);
        }
        to {
            transform: rotateY(360deg) rotateZ(90deg);
        }
    }

    @keyframes spin-b {
        from {
            transform: rotateZ(0deg) rotateY(0deg);
        }
        to {
            transform: rotateZ(360deg) rotateY(90deg);
        }
    }

    @keyframes spin-c {
        from {
            transform: rotateX(0deg) rotateY(0deg);
        }
        to {
            transform: rotateX(360deg) rotateY(90deg);
        }
    }

    @keyframes spin {
        from {
            transform: rotateY(0deg) rotateX(0deg);
        }
        to {
            transform: rotateY(360deg) rotateX(360deg);
        }
    }
</style>
