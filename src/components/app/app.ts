import Levels from '../levels/levels';
export default class App {
    start() {
        const levels = new Levels();
        levels.initialize();
    }
}
