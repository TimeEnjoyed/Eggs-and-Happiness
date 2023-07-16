import * as THREE from 'three';


const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;



    const directionalLight = new THREE.DirectionalLight(0x9090aa);
    directionalLight.position.set(-10, 10, -10).normalize();
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemisphereLight.position.set(1, 1, 1);
    scene.add(hemisphereLight);


    return {
        scene,
        camera,
        //renderer
    };
};

const createObjects = (scene) => {
    const geometry = new THREE.BoxGeometry();



    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        metalness: 0.13
    });



    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    return cube;
};




const update = (cube, world) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += world.z;

};

const render = (scene, camera, renderer) => {
    renderer.render(scene, camera);
};

const handleResize = (camera, renderer) => {

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();


};



let renderer;

let dt = 1000 / 30;
let timeTarget = 0;

export const createScene = (el, world) => {

    console.log("CREATE:SCENE");
    console.log(world);
    const {
        scene,
        camera,
    } = init();
    const cube = createObjects(scene);



    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: el

    });
    renderer.setPixelRatio(window.devicePixelRatio)


    window.addEventListener('resize', () => handleResize(camera, renderer));

    handleResize(camera, renderer)
    const animate = () => {

        if (Date.now() >= timeTarget) {


            update(cube, world);
            render(scene, camera, renderer);
            timeTarget += dt;
            if (Date.now() >= timeTarget) {
                timeTarget = Date.now();
            }

        }
        requestAnimationFrame(animate);

    };

    animate();


};

//window.addEventListener('resize', resize);