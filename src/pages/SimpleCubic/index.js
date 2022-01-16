import React, {useEffect} from 'react';
import * as THREE from 'three';
import { CONTAINER_WIDTH } from '../../plugins/threeConfig'

const SimpleCubic = () => {
  useEffect(() => {
    // === THREE.JS CODE START ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, CONTAINER_WIDTH/window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( CONTAINER_WIDTH, window.innerHeight );
    const container = document.getElementById('container');
    container.appendChild( renderer.domElement );
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;
    const animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( scene, camera );
    };
    animate();
    // === THREE.JS EXAMPLE CODE END ===
  })


  return (
    <div className="SimpleCubic" id="container">
    </div>
  );
}

export default SimpleCubic;
