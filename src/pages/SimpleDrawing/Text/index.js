import React, {useEffect} from 'react';
import * as THREE from 'three';
import { CONTAINER_WIDTH } from '../../../plugins/threeConfig';
import Stats from 'three/examples/jsm/libs/stats.module';

import opt_bold from "../../../assets/fonts/optimer_bold.typeface.json";

const SimpleDrawingLine = () => {
  useEffect(() => {
    // === THREE.JS CODE START ===
    THREE.Cache.enabled = true;
    let container, stats, permalink, hex;
    let camera, cameraTarget, scene, renderer;
    let group, textMesh1, textMesh2, textGeo, materials;
    let firstLetter = true;
    let text = "three.js",
      bevelEnabled = true,
      font = undefined,
      fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
      fontWeight = "bold"; // normal bold

    const height = 20,
      size = 70,
      hover = 30,
      curveSegments = 4,
      bevelThickness = 2,
      bevelSize = 1.5;

    const mirror = true;
    const fontMap = {
      "helvetiker": 0,
      "optimer": 1,
      "gentilis": 2,
      "droid/droid_sans": 3,
      "droid/droid_serif": 4
    };
    const weightMap = {
      "regular": 0,
      "bold": 1
    };

    const reverseFontMap = [];
    const reverseWeightMap = [];

    for ( const i in fontMap ) reverseFontMap[ fontMap[ i ] ] = i;
    for ( const i in weightMap ) reverseWeightMap[ weightMap[ i ] ] = i;

    let targetRotation = 0;
    let targetRotationOnPointerDown = 0;
    let pointerX = 0;
    let pointerXOnPointerDown = 0;
    let windowHalfX = CONTAINER_WIDTH / 2;
    let fontIndex = 1;

    init();
    animate();

    function decimalToHex( d ) {
      let hex = Number( d ).toString( 16 );
      hex = "000000".substr( 0, 6 - hex.length ) + hex;
      return hex.toUpperCase();
    }

    function init() {
      // container = document.createElement( 'div' );
      // document.body.appendChild( container );
      container = document.getElementById('container_SimpleDrawingLine');
      
      permalink = document.getElementById( "permalink" );

      // CAMERA
      camera = new THREE.PerspectiveCamera( 30, CONTAINER_WIDTH / window.innerHeight, 1, 1500 );
      camera.position.set( 0, 400, 700 );
      cameraTarget = new THREE.Vector3( 0, 150, 0 );

      // SCENE
      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0x000000 );
      scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

      // LIGHTS
      const dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
      dirLight.position.set( 0, 0, 1 ).normalize();
      scene.add( dirLight );
      const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
      pointLight.position.set( 0, 100, 90 );
      scene.add( pointLight );

      // Get text from hash
      const hash = document.location.hash.substr( 1 );

      if ( hash.length !== 0 ) {
        const colorhash = hash.substring( 0, 6 );
        const fonthash = hash.substring( 6, 7 );
        const weighthash = hash.substring( 7, 8 );
        const bevelhash = hash.substring( 8, 9 );
        const texthash = hash.substring( 10 );

        hex = colorhash;
        pointLight.color.setHex( parseInt( colorhash, 16 ) );

        fontName = reverseFontMap[ parseInt( fonthash ) ];
        fontWeight = reverseWeightMap[ parseInt( weighthash ) ];
        bevelEnabled = parseInt( bevelhash );
        text = decodeURI( texthash );
        updatePermalink();
      } else {
        pointLight.color.setHSL( Math.random(), 1, 0.5 );
        hex = decimalToHex( pointLight.color.getHex() );
      }

      materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
      ];

      group = new THREE.Group();
      group.position.y = 100;
      scene.add( group );
      loadFont();

      const plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 10000, 10000 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
      );
      plane.position.y = 100;
      plane.rotation.x = - Math.PI / 2;
      scene.add( plane );

      // RENDERER
      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( CONTAINER_WIDTH, window.innerHeight );
      container.appendChild( renderer.domElement );

      // STATS
      stats = new Stats();
      //container.appendChild( stats.dom );

      // EVENTS
      container.style.touchAction = 'none';
      container.addEventListener( 'pointerdown', onPointerDown, false );
      document.addEventListener( 'keypress', onDocumentKeyPress, false );
      document.addEventListener( 'keydown', onDocumentKeyDown, false );

      document.getElementById( "color" ).addEventListener( 'click', function () {
        pointLight.color.setHSL( Math.random(), 1, 0.5 );
        hex = decimalToHex( pointLight.color.getHex() );
        updatePermalink();
      }, false );

      document.getElementById( "font" ).addEventListener( 'click', function () {
        fontIndex ++;
        fontName = reverseFontMap[ fontIndex % reverseFontMap.length ];
        loadFont();
      }, false );

      document.getElementById( "weight" ).addEventListener( 'click', function () {
        if ( fontWeight === "bold" ) {
          fontWeight = "regular";
        } else {
          fontWeight = "bold";
        }
        loadFont();
      }, false );

      document.getElementById( "bevel" ).addEventListener( 'click', function () {
        bevelEnabled = ! bevelEnabled;
        refreshText();
      }, false );

      //
      window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
      windowHalfX = CONTAINER_WIDTH / 2;
      camera.aspect = CONTAINER_WIDTH / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( CONTAINER_WIDTH, window.innerHeight );
    }

    //
    function boolToNum( b ) {
      return b ? 1 : 0;
    }

    function updatePermalink() {
      const link = hex + fontMap[ fontName ] + weightMap[ fontWeight ] + boolToNum( bevelEnabled ) + "#" + encodeURI( text );
      permalink.href = "#" + link;
      window.location.hash = link;
    }

    function onDocumentKeyDown( event ) {
      if ( firstLetter ) {
        firstLetter = false;
        text = "";
      }

      const keyCode = event.keyCode;
      // backspace
      if ( keyCode === 8 ) {
        event.preventDefault();
        text = text.substring( 0, text.length - 1 );
        refreshText();
        return false;
      }
    }

    function onDocumentKeyPress( event ) {
      const keyCode = event.which;
      // backspace
      if ( keyCode === 8 ) {
        event.preventDefault();
      } else {
        const ch = String.fromCharCode( keyCode );
        text += ch;
        refreshText();
      }
    }

    function loadFont() {
      // const loader = new THREE.FontLoader();
      font = new THREE.Font(opt_bold);

      refreshText();
      // loader.load( 'https://threejs.org/examples/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
      //   console.log("[font response]", response);
      //   font = response;
      //   refreshText();
      // } );
    }

    function createText() {
      textGeo = new THREE.TextGeometry( "three.js", {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled
      } );

      textGeo.computeBoundingBox();
      textGeo.computeVertexNormals();
      const triangle = new THREE.Triangle();

      // "fix" side normals by removing z-component of normals for side faces
      // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
      if ( ! bevelEnabled ) {
        const triangleAreaHeuristics = 0.1 * ( height * size );
        for ( let i = 0; i < textGeo.faces.length; i ++ ) {
          const face = textGeo.faces[ i ];
          if ( face.materialIndex === 1 ) {
            for ( let j = 0; j < face.vertexNormals.length; j ++ ) {
              face.vertexNormals[ j ].z = 0;
              face.vertexNormals[ j ].normalize();
            }
            const va = textGeo.vertices[ face.a ];
            const vb = textGeo.vertices[ face.b ];
            const vc = textGeo.vertices[ face.c ];
            const s = triangle.set( va, vb, vc ).getArea();
            if ( s > triangleAreaHeuristics ) {
              for ( let j = 0; j < face.vertexNormals.length; j ++ ) {
                face.vertexNormals[ j ].copy( face.normal );
              }
            }
          }
        }
      }

      const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
      textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
      textMesh1 = new THREE.Mesh( textGeo, materials );
      textMesh1.position.x = centerOffset;
      textMesh1.position.y = hover;
      textMesh1.position.z = 0;
      textMesh1.rotation.x = 0;
      textMesh1.rotation.y = Math.PI * 2;
      group.add( textMesh1 );

      if ( mirror ) {
        textMesh2 = new THREE.Mesh( textGeo, materials );
        textMesh2.position.x = centerOffset;
        textMesh2.position.y = - hover;
        textMesh2.position.z = height;
        textMesh2.rotation.x = Math.PI;
        textMesh2.rotation.y = Math.PI * 2;
        group.add( textMesh2 );
      }
    }

    function refreshText() {
      updatePermalink();
      group.remove( textMesh1 );
      if ( mirror ) group.remove( textMesh2 );
      if ( ! text ) return;

      createText();
    }

    function onPointerDown( event ) {
      if ( event.isPrimary === false ) return;
      pointerXOnPointerDown = event.clientX - windowHalfX;
      targetRotationOnPointerDown = targetRotation;
      document.addEventListener( 'pointermove', onPointerMove, false );
      document.addEventListener( 'pointerup', onPointerUp, false );
    }

    function onPointerMove( event ) {
      if ( event.isPrimary === false ) return;
      pointerX = event.clientX - windowHalfX;
      targetRotation = targetRotationOnPointerDown + ( pointerX - pointerXOnPointerDown ) * 0.02;
    }

    function onPointerUp(event) {
      if ( event.isPrimary === false ) return;
      document.removeEventListener( 'pointermove', onPointerMove );
      document.removeEventListener( 'pointerup', onPointerUp );
    }

    //
    function animate() {
      requestAnimationFrame( animate );
      render();
      stats.update();
    }

    function render() {
      group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
      camera.lookAt( cameraTarget );
      renderer.clear();
      renderer.render( scene, camera );
    }
    // === THREE.JS EXAMPLE CODE END ===
  })

  return (
    <>
      <div id="info">
        <button id="color">change color</button>
        <button id="font">change font</button>
        <button id="weight">change weight</button>
        <button id="bevel">change bevel</button><br/>
        <a id="permalink" href="/">permalink</a>
      </div>
      <div className="SimpleDrawingLine" id="container_SimpleDrawingLine">
      </div>
    </>
  );
}

export default SimpleDrawingLine;
