import { WaveAnimation } from './wave-animation';

export function TestWave() {
  return (
    <section className="relative h-[400px] overflow-hidden">
      <WaveAnimation />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h2 className="text-white text-2xl font-light tracking-wide">Wave Animation Test Section</h2>
      </div>
    </section>
  );
}