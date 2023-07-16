<script>
    import { onMount } from "svelte";

    export let clockIdx = 0;
    export let clockMode = "A";

    

    const get_clock_img = (val) => {
        return "/img/clock" + clockMode + val + ".png";
    };
</script>

<div class="container">
    <div class="cube rounded p-0 m-0 {'cube-spin-' + clockIdx}">
        <div
            class="p-0 m-0 face rounded front d-flex align-items-center justify-content-center text-center center align-middle align-middle h-100"
        >
            <img src={get_clock_img(clockIdx)} class="img-fluid p-2 m-1 text-center" />
        </div>
        <div class="face p-0 m-0 back rounded" />
        <div class="face right rounded" />
        <div class="face left rounded" />
        <div class="face top rounded" />
        <div class="face bottom rounded" />
    </div>
</div>



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

    .cube-spin-0 {
        animation: spin-a 0.6s linear;
        animation-iteration-count: 1;
    }
    .cube-spin-1 {
        animation: spin-b 0.6s linear;
        animation-iteration-count: 1;
    }

    .cube-spin-2 {
        animation: spin-c 0.6s linear;
        animation-iteration-count: 1;
    }
    .cube-spin-3 {
        animation: spin-d 0.6s linear;
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
    }
    .bottom {
        transform: rotateX(-90deg) translateZ(var(--transZ));
        border: 0px solid #333;
    }

    .right {
        transform: rotateY(90deg) translateZ(var(--transZ));
    }
    .left {
        transform: rotateY(-90deg) translateZ(var(--transZ));
    }

    .front {
        transform: rotateX(0deg) translateZ(var(--transZ));
        border: 0px solid #333;
    }
    .back {
        transform: rotateX(-180deg) translatanimeZ(var(--transZ));
        border: 0px solid #333;
    }

    @keyframes spin-a {
        from {
            transform: rotateZ(-90deg);
        }
        to {
            transform: rotateZ(0deg);
        }
    }

    @keyframes spin-b {
        from {
            transform: rotateZ(-90deg);
        }
        to {
            transform: rotateZ(0deg);
        }
    }

    @keyframes spin-c {
        from {
            transform: rotateZ(-90deg);
        }
        to {
            transform: rotateZ(0deg);
        }
    }
    @keyframes spin-d {
        from {
            transform: rotateZ(-90deg);
        }
        to {
            transform: rotateZ(0deg);
        }
    }

</style>
