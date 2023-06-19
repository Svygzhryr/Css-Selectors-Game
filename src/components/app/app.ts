import Levels from '../levels/setUpLevels';
export default class App {
    start() {
        const levels = new Levels();
        levels.initialize();
    }
}
