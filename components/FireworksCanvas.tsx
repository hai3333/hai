import React, { useEffect, useRef, useCallback } from 'react';
import { FireworkType } from '../types';

interface FireworksCanvasProps {
  fireworkType: FireworkType;
  autoPlay: boolean;
}

// --- Physics Constants ---
const GRAVITY = 0.035; // Lower gravity for longer hang time
const DRAG = 0.96; // Less drag allows them to expand bigger
const PARTICLE_COUNT = 150; // Increased from 80
const HEART_PARTICLE_COUNT = 350; // Much denser hearts (was 120)

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  size: number;
  history: {x: number, y: number}[];

  constructor(x: number, y: number, color: string, vx: number, vy: number, decay: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.alpha = 1;
    this.decay = decay;
    // Bigger particles for "Cooler" look
    this.size = Math.random() * 3 + 1.5; 
    this.history = [];
  }

  update() {
    this.history.push({x: this.x, y: this.y});
    if (this.history.length > 6) this.history.shift(); // Longer trails

    this.vx *= DRAG;
    this.vy *= DRAG;
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    
    // Draw trail
    if (this.history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for(let i = 1; i < this.history.length; i++) {
            ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size * 0.6; // Thicker trails
        ctx.stroke();
    }
    
    ctx.restore();
  }
}

class Firework {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  hue: number;
  brightness: number;
  distanceToTarget: number;
  distanceTraveled: number;
  coordinates: {x: number, y: number}[];
  angle: number;
  speed: number = 2;
  acceleration: number = 1.05;
  exploded: boolean = false;
  particles: Particle[] = [];
  type: FireworkType;

  constructor(sx: number, sy: number, tx: number, ty: number, type: FireworkType) {
    this.x = sx;
    this.y = sy;
    this.targetX = tx;
    this.targetY = ty;
    this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    
    // Color logic: Extended Pink/Purple/Gold range
    // Randomly shift between Pink (320-340) and Gold/Warm (30-50) occasionally
    if (Math.random() > 0.8) {
       this.hue = Math.floor(Math.random() * 30) + 20; // Gold/Orange
    } else {
       this.hue = Math.floor(Math.random() * 60) + 300; // Pink/Purple/Red
    }
    
    this.brightness = Math.random() * 20 + 70; // Brighter
    this.type = type;
  }

  update(ctx: CanvasRenderingContext2D): boolean {
    if (this.exploded) {
      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update();
        if (this.particles[i].alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
      return this.particles.length === 0; // Return true if completely dead
    } else {
      // Move firework up
      this.coordinates.push({ x: this.x, y: this.y });
      if (this.coordinates.length > 3) this.coordinates.shift();

      this.speed *= this.acceleration;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      
      this.distanceTraveled = Math.sqrt(Math.pow(this.x - vx - (this.x - this.distanceTraveled * Math.cos(this.angle)), 2) + Math.pow(this.y - vy - (this.y - this.distanceTraveled * Math.sin(this.angle)), 2)) + this.distanceTraveled; 
      
      this.x += vx;
      this.y += vy;
      
      // Check if reached target
      const distanceRemaining = Math.sqrt(Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2));
      
      if (distanceRemaining < this.speed || (this.y < this.targetY && this.vy < 0)) {
        this.explode();
      }
      return false;
    }
  }

  explode() {
    this.exploded = true;
    const particleCount = this.type === FireworkType.HEART ? HEART_PARTICLE_COUNT : PARTICLE_COUNT;
    
    for (let i = 0; i < particleCount; i++) {
        let vx, vy;
        // Longer life span for particles (slower decay)
        const decay = Math.random() * 0.012 + 0.008; 

        if (this.type === FireworkType.HEART) {
            // Heart shape parametric equations
            const t = (Math.PI * 2 / particleCount) * i;
            
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            
            // Scaled up significantly: Divisor reduced from 10 to ~5.5
            vx = (hx / 5.5); 
            vy = (hy / 5.5);
            
            // Randomness
            vx += (Math.random() - 0.5) * 0.5;
            vy += (Math.random() - 0.5) * 0.5;

        } else {
            // Standard Explosion - Bigger spread
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 8 + 2; // Much wider range (was 3+1)
            vx = Math.cos(angle) * r;
            vy = Math.sin(angle) * r;
        }

        const color = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        this.particles.push(new Particle(this.x, this.y, color, vx, vy, decay));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.exploded) {
      for (const p of this.particles) p.draw(ctx);
    } else {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1].x, this.coordinates[this.coordinates.length - 1].y);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
      ctx.lineWidth = 3; 
      ctx.stroke();
      
      // Glowing head
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI*2);
      ctx.fillStyle = `white`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 80%)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}

const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ fireworkType, autoPlay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const animationFrameRef = useRef<number>(0);
  const autoPlayTimerRef = useRef<number | null>(null);

  const spawnFirework = useCallback((tx: number, ty: number) => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current;
    
    // Start from bottom center-ish with wider variance
    const sx = width / 2 + (Math.random() - 0.5) * (width * 0.6);
    const sy = height;
    
    fireworksRef.current.push(new Firework(sx, sy, tx, ty, fireworkType));
  }, [fireworkType]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    spawnFirework(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
     const rect = canvasRef.current?.getBoundingClientRect();
     if (!rect) return;
     const touch = e.touches[0];
     spawnFirework(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  // Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const loop = () => {
      // Slower fade out for longer trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalCompositeOperation = 'lighter'; 

      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        const isDead = fw.update(ctx);
        fw.draw(ctx);
        if (isDead) {
          fireworksRef.current.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Auto Play Logic
  useEffect(() => {
    if (autoPlay) {
      // Faster auto play (800ms instead of 1200ms) for "More" fireworks
      const interval = window.setInterval(() => {
        if (!canvasRef.current) return;
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        // Random target, slightly higher up to allow for big explosions
        const tx = Math.random() * w * 0.8 + w * 0.1;
        const ty = Math.random() * h * 0.5 + h * 0.1;
        spawnFirework(tx, ty);
      }, 800); 
      autoPlayTimerRef.current = interval;
    } else {
      if (autoPlayTimerRef.current !== null) window.clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current !== null) window.clearInterval(autoPlayTimerRef.current);
    };
  }, [autoPlay, spawnFirework]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full cursor-pointer touch-none"
      onClick={handleCanvasClick}
      onTouchStart={handleTouch}
    />
  );
};

export default FireworksCanvas;