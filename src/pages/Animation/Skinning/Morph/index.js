import React, { useEffect } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import { CONTAINER_WIDTH } from '../../../../plugins/threeConfig';

const AnimationSkinningMorph = () => {
  useEffect(() => {
    let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
			let camera, scene, renderer, model, face, controls;

			const api = { state: 'Walking' };

			init();
			animate();

			function init() {
				// container = document.createElement( 'div' );
        // document.body.appendChild( container );
        container = document.getElementById('morph_container');

				camera = new THREE.PerspectiveCamera(45, CONTAINER_WIDTH / window.innerHeight, 0.25, 100);
				camera.position.set( - 5, 3, 10 );
        camera.lookAt(new THREE.Vector3( 0, 2, 0 ));
        
      	scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xe0e0e0 );
				scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );
				clock = new THREE.Clock();

				// lights
				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 20, 0 );
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 0, 20, 10 );
				scene.add( dirLight );

				// ground
				const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				scene.add( mesh );

				const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
				grid.material.opacity = 0.2;
				grid.material.transparent = true;
				scene.add( grid );

				// model
				const loader = new GLTFLoader();
				loader.load( 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function ( gltf ) {
					model = gltf.scene;
					scene.add( model );
					createGUI( model, gltf.animations );
				}, undefined, function ( e ) {
					console.error( e );
				});

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( CONTAINER_WIDTH, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
				container.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
        
        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.5, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

				// stats
				stats = new Stats();
				container.appendChild( stats.dom );
			}

			function createGUI( model, animations ) {
				const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
				const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];
				gui = new GUI();
				mixer = new THREE.AnimationMixer( model );
				actions = {};
				for ( let i = 0; i < animations.length; i ++ ) {
					const clip = animations[ i ];
					const action = mixer.clipAction( clip );
					actions[ clip.name ] = action;
					if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {
						action.clampWhenFinished = true;
						action.loop = THREE.LoopOnce;
					}
				}

				// states
				const statesFolder = gui.addFolder( 'States' );
				const clipCtrl = statesFolder.add( api, 'state' ).options( states );
				clipCtrl.onChange( function () {
					fadeToAction( api.state, 0.5 );
				} );

				statesFolder.open();
				// emotes
				const emoteFolder = gui.addFolder( 'Emotes' );
				function createEmoteCallback( name ) {
					api[ name ] = function () {
						fadeToAction( name, 0.2 );
    					mixer.addEventListener( 'finished', restoreState );
					};
					emoteFolder.add( api, name );
				}

				function restoreState() {
					mixer.removeEventListener( 'finished', restoreState );
					fadeToAction( api.state, 0.2 );
				}

				for ( let i = 0; i < emotes.length; i ++ ) {
					createEmoteCallback( emotes[ i ] );
				}

				emoteFolder.open();

				// expressions
				face = model.getObjectByName( 'Head_4' );
				const expressions = Object.keys( face.morphTargetDictionary );
				const expressionFolder = gui.addFolder( 'Expressions' );
				for ( let i = 0; i < expressions.length; i ++ ) {
					expressionFolder.add( face.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] );
				}

				activeAction = actions[ 'Walking' ];
				activeAction.play();
				expressionFolder.open();
			}

			function fadeToAction( name, duration ) {
				previousAction = activeAction;
				activeAction = actions[ name ];
				if ( previousAction !== activeAction ) {
					previousAction.fadeOut( duration );
				}

				activeAction
					.reset()
					.setEffectiveTimeScale( 1 )
					.setEffectiveWeight( 1 )
					.fadeIn( duration )
					.play();
			}

			function onWindowResize() {
				camera.aspect = CONTAINER_WIDTH / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( CONTAINER_WIDTH, window.innerHeight );
			}

			function animate() {
				const dt = clock.getDelta();
				if ( mixer ) mixer.update( dt );
				requestAnimationFrame( animate );
        renderer.render( scene, camera );
        // controls.update();
				stats.update();
			}
  })
  return (
    <>
      <div id="info">
        <a href="https://threejs.org" target="_blank" rel="noreferrer">three.js</a> webgl - skinning and morphing<br />
        <p>
          The animation system allows clips to be played individually, looped, or crossfaded with other clips. This example shows a character looping in one of several base animation states, then transitioning smoothly to one-time actions. Facial expressions are controlled independently with morph targets.
        </p>
        Model by
        <a href="https://www.patreon.com/quaternius" target="_blank" rel="noreferrer">Tomás Laulhé</a>,
        modifications by <a href="https://donmccurdy.com/" target="_blank" rel="noreferrer">Don McCurdy</a>. CC0.<br />
      </div>
      <div id="morph_container"></div>
    </>
  )
};

export default AnimationSkinningMorph;
