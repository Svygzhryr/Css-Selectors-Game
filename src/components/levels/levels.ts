export default class Levels {
    title: Element | null;
    table: Element | null;
    constructor() {
        this.title = document.querySelector('.headline');
        this.table = document.querySelector('.table');
    }

    initialize() {
        const clearTable = () => {
            if (this.table) {
                this.table.innerHTML = '';
            }
        };
        const handleLevelSelect = (e: Event) => {
            clearTable();
            if (e.target instanceof Element) {
                const element = e.target as HTMLElement | null;
                if (this.title && element) {
                    if (!element.classList.contains('levels__item_active')) {
                        document.querySelectorAll('.levels__item').forEach((l) => {
                            l.classList.remove('levels__item_active');
                        });
                        element.classList.add('levels__item_active');
                    }
                    this.title.innerHTML = element.innerHTML;
                }
                switch (element?.dataset.level) {
                    case '1':
                        this.levelOne();
                        break;
                    case '2':
                        this.levelTwo();
                        break;
                    case '3':
                        this.levelThree();
                        break;
                    case '4':
                        this.levelFour();
                        break;
                    case '5':
                        this.levelFive();
                        break;
                    case '6':
                        this.levelSix();
                        break;
                    case '7':
                        this.levelSeven();
                        break;
                    case '8':
                        this.levelEight();
                        break;
                    case '9':
                        this.levelNine();
                        break;
                    case '10':
                        this.levelTen();
                        break;
                }
            }
        };

        function handleLevelReset() {
            console.log('reset all');
        }

        document.querySelectorAll('.levels__item').forEach((e) => {
            e.addEventListener('click', handleLevelSelect);
        });

        document.querySelector('.reset')?.addEventListener('click', handleLevelReset);
    }

    levelOne() {
        console.log('execute this level');
    }

    levelTwo() {
        console.log('execute this level');
    }

    levelThree() {
        console.log('execute this level');
    }

    levelFour() {
        console.log('execute this level');
    }

    levelFive() {
        console.log('execute this level');
    }

    levelSix() {
        console.log('execute this level');
    }

    levelSeven() {
        console.log('execute this level');
    }

    levelEight() {
        console.log('execute this level');
    }

    levelNine() {
        console.log('execute this level');
    }

    levelTen() {
        console.log('execute this level');
    }
}
