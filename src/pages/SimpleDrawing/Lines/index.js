import React, {useEffect} from 'react';
import * as THREE from 'three';
import { CONTAINER_WIDTH } from '../../../plugins/threeConfig'

const SimpleDrawingLine = () => {
  useEffect(() => {
    // === THREE.JS CODE START ===
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( CONTAINER_WIDTH, window.innerHeight );
    const container = document.getElementById('container_SimpleDrawingLine');
    container.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera( 45, CONTAINER_WIDTH/window.innerHeight, 1, 1000 );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );

    const points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );
    points.push( new THREE.Vector3( - 10, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const line = new THREE.Line(geometry, material);
    scene.add( line );

    renderer.render( scene, camera );
    // === THREE.JS EXAMPLE CODE END ===
  })


  return (
    <div className="SimpleDrawingLine" id="container_SimpleDrawingLine">
    </div>
  );
}

export default SimpleDrawingLine;
