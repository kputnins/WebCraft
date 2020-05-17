import Engine from './core/engine';

window.onload = (): void => {
  const engine = new Engine(
    document.getElementById('screen') as HTMLCanvasElement,
    16,
    9,
  );
  engine.start();
};
