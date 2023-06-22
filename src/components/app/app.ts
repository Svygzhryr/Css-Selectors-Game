import Levels from '../levels/levelLoader';
export default class App {
    start() {
        const levels = new Levels();
        levels.initialize();
    }
}
