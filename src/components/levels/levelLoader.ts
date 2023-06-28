// план:
// добавбить ещё шесть уровней и к тем у которых нет добавить HTML разметку
// добавить возможность применять селекторы мышкой
// добавить анимацию при выполнении и анимацию при неправильном селекторе

export default class Levels {
    title: Element | null;
    table: Element | null;
    HTMLField: Element;
    circle: Element;
    square: Element;
    jar: Element;
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

        const getCompletedLevels = () => {
            document.querySelectorAll('.levels__item').forEach((e, index) => {
                index++;
                if (localStorage.getItem(`level_${index}`)) {
                    e.classList.add('levels__item_passed');
                    e.removeEventListener('click', handleLevelSelect);
                }
            });
            const nextLevel = document.querySelector('.levels__item:not(.levels__item_passed)') as HTMLElement;
            nextLevel.classList.add('levels__item_passed');
            nextLevel.removeEventListener('click', handleLevelSelect);
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
                case 'allPassed': {
                    clearTable();
                    clearLevelHightlight();
                    const table = this.table as Element;
                    const title = this.title as Element;
                    const nextLevel = document.querySelector('.levels__item:not(.levels__item_passed)') as HTMLElement;
                    nextLevel.classList.add('levels__item_passed');
                    nextLevel.removeEventListener('click', handleLevelSelect);
                    title.innerHTML = 'Well done!';
                    table.innerHTML = "You've passed all levels.";
                    break;
                }
            }
            const hightlightLevel = document.querySelector(`[data-level='${localStorage.getItem('currentLevel')}']`);
            hightlightLevel?.classList.add('levels__item_active');
        };

        setLevel();
        getCompletedLevels();

        const handleLevelSelect = (e: Event) => {
            const et = e.target as HTMLElement;
            if (!et.classList.contains('levels__item_passed')) {
                clearTable();
                clearHTMLField();
                updateInfo(e);
            }
        };

        const finishLevel = () => {
            // задержку добавить надо
            document.querySelector('.target')?.addEventListener('animationend', () => {
                clearTable();
                clearHTMLField();
                const currentLevelLabel = document.querySelector('.levels__item_active') as HTMLElement;
                currentLevelLabel?.classList.add('levels__item_passed');
                currentLevelLabel?.classList.remove('levels__item_active');
                currentLevelLabel?.removeEventListener('click', handleLevelSelect);

                const nextLevel = document.querySelector('.levels__item:not(.levels__item_passed)') as HTMLElement;
                if (!nextLevel) {
                    localStorage.setItem('currentLevel', 'allPassed');
                    clearTable();
                    clearLevelHightlight();
                    const table = this.table as Element;
                    const title = this.title as Element;
                    title.innerHTML = 'Well done!';
                    table.innerHTML = "You've passed all levels.";
                    return;
                }

                localStorage.setItem('currentLevel', `${nextLevel.dataset.level}`);
                localStorage.setItem(`level_${currentLevelLabel?.dataset.level}`, 'done');
                setLevel(nextLevel);
                clearLevelHightlight();
                nextLevel.classList.add('levels__item_active');
                const input = document.querySelector('input') as HTMLInputElement;
                input.value = '';
            });
        };

        const handleSelectorApply = (e: Event) => {
            const input = e.target as HTMLInputElement;
            input.addEventListener('keydown', (l) => {
                if (l.key !== 'Enter') {
                    return;
                }
                const selector = input?.value;
                try {
                    const selectedElements = document.querySelectorAll<HTMLElement>(selector);
                    const arr = Array.from(selectedElements);
                    const check = arr.every((l) => {
                        return l.classList.contains('target');
                    });
                    if (check && arr.length !== 0) {
                        selectedElements.forEach((e) => e.classList.add('selection'));
                        selectedElements.forEach((e) => (e.style.animation = ''));
                        finishLevel();
                    } else {
                        console.log('hello boi');
                        selectedElements.forEach((e) => {
                            e.style.removeProperty('animation');
                        });
                        selectedElements.forEach((e) => (e.style.animation = ''));
                        selectedElements.forEach((e) => (e.style.animation += 'wrong 0.8s ease-in-out'));
                        const targets = document.querySelectorAll<HTMLElement>('.target');
                        targets.forEach((e) => {
                            // wait
                        });
                    }
                } catch {
                    return null;
                }
            });
            input.removeEventListener('click', handleSelectorApply);
        };

        const handleLevelReset = () => {
            document.querySelectorAll('.levels__item').forEach((e, index) => {
                index++;
                localStorage.setItem(`level_${index}`, '');
                e.classList.remove('levels__item_passed');
            });
            clearHTMLField();
            clearTable();
            clearLevelHightlight();
            localStorage.setItem('currentLevel', '1');
            setLevel(document.querySelector('[data-level="1"]') as HTMLElement);
            document.querySelectorAll('.levels__item').forEach((e) => {
                e.addEventListener('click', handleLevelSelect);
            });
        };

        document.querySelectorAll('.levels__item').forEach((e) => {
            e.addEventListener('click', handleLevelSelect);
        });

        document.querySelector('.reset')?.addEventListener('click', handleLevelReset);
        document.querySelector('.css-editor__selector')?.addEventListener('click', handleSelectorApply);
    }

    levelOne() {
        this.table?.appendChild(this.circle.cloneNode(true));
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('.square')?.classList.add('target');
        this.table?.appendChild(this.jar.cloneNode(true));

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
        this.table?.appendChild(this.circle.cloneNode(true));
        this.table?.appendChild(this.jar.cloneNode(true));
        document.querySelector('.jar')?.appendChild(this.circle.cloneNode(true));
        document.querySelector('circle:last-child')?.classList.remove('table__item');
        document.querySelector('circle:last-child')?.classList.add('target');

        const htmlCircle = document.createElement('div');
        const htmlJar = document.createElement('div');

        this.HTMLField?.appendChild(htmlCircle);
        htmlCircle.appendChild(document.createTextNode('<circle />'));

        this.HTMLField?.appendChild(htmlJar);
        htmlJar.appendChild(document.createTextNode('<jar />'));
    }

    levelThree() {
        this.table?.appendChild(this.circle.cloneNode(true));
        this.table?.appendChild(this.circle.cloneNode(true));
        document.querySelector('circle:first-child')?.classList.add('target');

        let htmlCircle = document.createElement('div');

        this.HTMLField?.appendChild(htmlCircle);

        this.HTMLField?.appendChild(htmlCircle);
        htmlCircle.appendChild(document.createTextNode('<circle />'));
        htmlCircle = document.createElement('div');
        this.HTMLField?.appendChild(htmlCircle);
        htmlCircle.appendChild(document.createTextNode('<circle />'));
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
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('.square')?.classList.add('target');
    }

    levelSix() {
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('.square')?.classList.add('target');
    }

    levelSeven() {
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('.square')?.classList.add('target');
    }

    levelEight() {
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('.square')?.classList.add('target');
    }

    levelNine() {
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('.square')?.classList.add('target');
    }

    levelTen() {
        this.table?.appendChild(this.square.cloneNode(true));
        document.querySelector('.square')?.classList.add('target');
    }
}
