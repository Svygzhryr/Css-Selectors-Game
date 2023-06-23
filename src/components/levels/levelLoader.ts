export default class Levels {
    title: Element | null;
    table: Element | null;
    HTMLField: Element;
    circle: Element;
    square: Element;
    jar: Element;
    // currentLevel: number;
    constructor() {
        this.title = document.querySelector('.headline');
        this.table = document.querySelector('.table');
        this.HTMLField = document.querySelector('.markup-viewer__html') as HTMLElement;

        this.circle = document.createElement('circle');
        this.circle.className = 'table__item circle';

        this.square = document.createElement('square');
        this.square.className = 'table__item square';

        this.jar = document.createElement('jar');
        this.jar.className = 'table__item jar';

        // this.currentLevel;
    }

    initialize() {
        const clearTable = () => {
            if (this.table) {
                this.table.innerHTML = '';
            }
        };

        const clearLevelHightlight = () => {
            document.querySelectorAll('.levels__item').forEach((l) => {
                l.classList.remove('levels__item_active');
            });
        };

        const clearHTMLField = () => {
            this.HTMLField.innerHTML = '';
        };

        const updateInfo = (e?: Event) => {
            if (e?.target instanceof Element) {
                const element = e.target as HTMLElement | null;
                if (this.title && element) {
                    if (!element.classList.contains('levels__item_active')) {
                        clearLevelHightlight();
                        element.classList.add('levels__item_active');
                        localStorage.setItem('currentLevel', `${element.dataset.level}`);
                    }
                    this.title.innerHTML = element.innerHTML;
                    localStorage.setItem('title', `${element.innerHTML}`);
                }
                setLevel(element);
            }
        };

        const setLevel = (element?: HTMLElement | null) => {
            if (this.title) {
                const storedTitle = localStorage.getItem('title') as string;
                this.title.innerHTML = storedTitle;
            }
            switch (element?.dataset.level || localStorage.getItem('currentLevel')) {
                default:
                    this.levelOne();
                    break;
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
            const hightlightLevel = document.querySelector(`[data-level='${localStorage.getItem('currentLevel')}']`);
            hightlightLevel?.classList.add('levels__item_active');
        };

        setLevel();
        const handleLevelSelect = (e: Event) => {
            clearTable();
            clearHTMLField();
            updateInfo(e);
        };

        const handleLevelReset = () => {
            console.log('reset all');
        };

        async function finishLevel(l: Element) {
            l.classList.add('selection');
            // задержку добавить надо
            clearTable();
            clearHTMLField();
            // сделать чтобы при выполнении уровня он зачёркивался
            const currentLevelLabel = document.querySelector('.levels__item_active');
            console.log(currentLevelLabel, 'current');
            currentLevelLabel?.classList.add('levels__item_passed');
            currentLevelLabel?.classList.remove('levels__item_active');
            currentLevelLabel?.removeEventListener('click', handleLevelSelect);

            const nextLevel = document.querySelector('.levels__item:not(.levels__item_passed)') as HTMLElement;

            setLevel(nextLevel);
            clearLevelHightlight();
            nextLevel.classList.add('levels__item_active');
        }

        function handleSelectorApply(e: Event) {
            const input = e.target as HTMLTextAreaElement;
            const selector = input?.value;
            // улучшить и исправить проверку
            document.querySelectorAll(selector).forEach((l) => {
                if (l.classList.contains('target')) {
                    finishLevel(l);
                } else {
                    // error sign
                }
            });
        }

        document.querySelectorAll('.levels__item').forEach((e) => {
            e.addEventListener('click', handleLevelSelect);
        });

        document.querySelector('.reset')?.addEventListener('click', handleLevelReset);
        document.querySelector('.css-editor__selector')?.addEventListener('change', handleSelectorApply);
    }

    levelOne() {
        this.table?.appendChild(this.circle.cloneNode(true));
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('.square')?.classList.add('target');
        this.table?.appendChild(this.jar.cloneNode(true));
        //
        const htmlCircle = document.createElement('div');
        this.HTMLField?.appendChild(htmlCircle);
        htmlCircle.appendChild(document.createTextNode('<circle />'));
        const htmlSquare = document.createElement('div');
        this.HTMLField?.appendChild(htmlSquare);
        htmlSquare.appendChild(document.createTextNode('<square />'));
        const htmlJar = document.createElement('div');
        this.HTMLField?.appendChild(htmlJar);
        htmlJar.appendChild(document.createTextNode('<jar />'));
    }

    levelTwo() {
        // this.currentLevel = 1;
        this.table?.appendChild(this.circle.cloneNode(true));
        this.table?.appendChild(this.jar.cloneNode(true));
        document.querySelector('.jar')?.appendChild(this.circle.cloneNode(true));
        document.querySelector('circle:last-child')?.classList.remove('table__item');
        document.querySelector('circle:last-child')?.classList.add('target');
    }

    levelThree() {
        this.table?.appendChild(this.circle.cloneNode(true));
        this.table?.appendChild(this.circle.cloneNode(true));
        this.table?.appendChild(this.circle.cloneNode(true));
        document.querySelector('circle:last-child')?.classList.add('target');
        document.querySelector('circle:first-child')?.classList.add('target');
    }

    levelFour() {
        this.table?.appendChild(this.square.cloneNode(true));
        this.table?.appendChild(this.square.cloneNode(true));
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('square:nth-child(2)')?.classList.add('target');
        const psquare = document.querySelector('square:nth-child(2)') as Element;
        psquare.id = 'purple';
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
