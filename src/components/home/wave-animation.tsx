import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function WaveAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configuration
    const SEPARATION = 120;
    const AMOUNTX = 40;
    const AMOUNTY = 40;
    const COLOR_PRIMARY = new THREE.Color('#10b981'); // Primary green
    const COLOR_SECONDARY = new THREE.Color('#059669'); // Secondary green
    const LINE_COLOR = new THREE.Color('#0d9488'); // Line color

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      55,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      10000
    );
    camera.position.z = 1000;
    camera.position.y = 300;
    camera.position.x = 0;
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particles setup
    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);
    const particleColors = new Float32Array(numParticles * 3);

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        
        scales[j] = 1;
        
        // Create a gradient of colors
        const mixRatio = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
        const color = COLOR_PRIMARY.clone().lerp(COLOR_SECONDARY, mixRatio);
        particleColors[i] = color.r;
        particleColors[i + 1] = color.g;
        particleColors[i + 2] = color.b;
        
        i += 3;
        j++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('particleColor', new THREE.BufferAttribute(particleColors, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float scale;
        attribute vec3 particleColor;
        varying vec3 vColor;
        void main() {
          vColor = particleColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = scale * 5.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
          gl_FragColor = vec4(vColor, 0.8);
        }
      `,
      transparent: true
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.x = -Math.PI / 5; // Tilt the wave field
    scene.add(particles);
    particlesRef.current = particles;

    // Create lines connecting the dots
    const lineIndices = [];
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const index = ix * AMOUNTY + iy;
        
        // Connect to right neighbor
        if (ix < AMOUNTX - 1) {
          lineIndices.push(index, index + AMOUNTY);
        }
        
        // Connect to bottom neighbor
        if (iy < AMOUNTY - 1) {
          lineIndices.push(index, index + 1);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setIndex(lineIndices);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: LINE_COLOR,
      transparent: true,
      opacity: 0.2,
      linewidth: 1
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lines.rotation.x = -Math.PI / 5; // Same tilt as particles
    scene.add(lines);
    linesRef.current = lines;

    // Animation
    let count = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const particlePositions = particles.geometry.attributes.position.array;
      const linePositions = lines.geometry.attributes.position.array;
      const scales = particles.geometry.attributes.scale.array;

      let i = 0, j = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          // Wave pattern - slower motion with reduced count increment
          const height = Math.sin((ix + count) * 0.2) * 50 + 
                         Math.sin((iy + count) * 0.3) * 50;
          
          particlePositions[i + 1] = height;
          linePositions[i + 1] = height;
          
          // Scale variation
          scales[j] = Math.sin((ix + count) * 0.2) + 1.5 +
                     Math.sin((iy + count) * 0.3) * 0.5;
          
          i += 3;
          j++;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.scale.needsUpdate = true;
      lines.geometry.attributes.position.needsUpdate = true;
      
      // Update time uniform for potential shader effects
      (material as THREE.ShaderMaterial).uniforms.time.value = count * 0.01;

      renderer.render(scene, camera);
      count += 0.05; // Reduced speed (was 0.1)
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full"
    />
  );
}