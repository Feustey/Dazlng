"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeHero: React.FC = (): React.ReactElement => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Initialisation de la scène
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Exemple : un simple cube animé
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation liée au scroll
    const animate = (): void => {
      requestAnimationFrame(animate);
      // Rotation du cube en fonction du scroll
      const scrollY = window.scrollY || window.pageYOffset;
      cube.rotation.x = scrollY * 0.01;
      cube.rotation.y = scrollY * 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Nettoyage
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-[300px] relative z-[1] mb-8"
    />
  );
};

export default ThreeHero; 