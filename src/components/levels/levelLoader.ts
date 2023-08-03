export default class Levels {
    title: Element | null;
    table: Element | null;
    HTMLField: Element;
    circle: Element;
    square: Element;
    jar: Element;
    items: Element | null;
    constructor() {
        this.title = document.querySelector('.headline');
        this.table = document.querySelector('.table');
        this.items = document.querySelector('.items');
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
                if (localStorage.getItem(`level_${index + 1}`)) {
                    e.classList.add('levels__item_passed');
                    e.removeEventListener('click', handleLevelSelect);
                }
            });
        };

        const updateInfo = (e: Event) => {
            if (e.target instanceof Element) {
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
                default:
                    this.levelOne();
                    break;
            }
            const hightlightLevel = document.querySelector(`[data-level='${localStorage.getItem('currentLevel')}']`);
            hightlightLevel?.classList.add('levels__item_active');
            const hint = document.querySelector('.css-editor__hint') as HTMLElement;
            const gotHint = localStorage.getItem('hint') as string;
            hint.innerHTML = gotHint;

            const elements = this.items?.querySelectorAll<HTMLElement>('[data-element]');
            if (!elements) {
                return;
            }
            elements?.forEach((e: HTMLElement) => {
                e.addEventListener(
                    'mouseover',
                    (l) => {
                        const hoveredElement = l.target as HTMLElement;
                        const selectedBlock = document.querySelector(
                            `[data-block="${hoveredElement.dataset.element}"]`
                        );
                        selectedBlock?.classList.add('enhanced');
                    },
                    true
                );
                e.addEventListener(
                    'mouseout',
                    (l) => {
                        const hoveredElement = l.target as HTMLElement;
                        const selectedBlock = document.querySelector(
                            `[data-block="${hoveredElement.dataset.element}"]`
                        );
                        selectedBlock?.classList.remove('enhanced');
                    },
                    true
                );
            });

            const blocks = this.HTMLField.querySelector('div') as HTMLElement;
            if (!blocks) {
                return;
            }
            const blocksItems = blocks.querySelectorAll<HTMLElement>('[data-block]');
            blocksItems.forEach((e: HTMLElement) => {
                e.addEventListener(
                    'mouseover',
                    (_item_) => {
                        _item_.stopPropagation();
                        const hoveredElement = _item_.currentTarget as HTMLElement;
                        hoveredElement.classList.add('enhanced');
                        const selectedBlock = document.querySelector(
                            `[data-element="${hoveredElement.dataset.block}"]`
                        );
                        selectedBlock?.classList.add('el-enhanced');
                    },
                    false
                );
                e.addEventListener(
                    'mouseout',
                    (l) => {
                        l.stopPropagation();
                        const hoveredElement = l.currentTarget as HTMLElement;
                        hoveredElement.classList.remove('enhanced');
                        const selectedBlock = document.querySelector(
                            `[data-element="${hoveredElement.dataset.block}"]`
                        );
                        selectedBlock?.classList.remove('el-enhanced');
                    },
                    false
                );
            });
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
            document.querySelector('.selection')?.addEventListener('animationend', () => {
                clearTable();
                clearHTMLField();
                const currentLevelLabel = document.querySelector('.levels__item_active') as HTMLElement;
                currentLevelLabel?.classList.add('levels__item_passed');
                currentLevelLabel?.classList.remove('levels__item_active');
                currentLevelLabel?.removeEventListener('click', handleLevelSelect);

                const nextLevel = document.querySelector('.levels__item:not(.levels__item_passed)') as HTMLElement;
                if (!nextLevel) {
                    localStorage.setItem('currentLevel', 'allPassed');
                    localStorage.setItem(`level_${currentLevelLabel?.dataset.level}`, 'done');
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
                const currentLevel = localStorage.getItem('currentLevel');
                const currentTitle = document.querySelector(`[data-level='${currentLevel}']`)?.innerHTML as string;
                localStorage.setItem('title', currentTitle);
                const title = this.title as Element;
                title.innerHTML = currentTitle;
                setLevel(nextLevel);
                clearLevelHightlight();
                nextLevel.classList.add('levels__item_active');
                const input = document.querySelector('input') as HTMLInputElement;
                input.value = '';
            });
        };

        const selectorApply = (input: HTMLInputElement) => {
            const selector = input?.value;
            const things = document.querySelector('.things') as Element;
            const selectedElements = things.querySelectorAll<HTMLElement>(selector);
            const arr = Array.from(selectedElements);
            const check = arr.every((l) => {
                return l.classList.contains('target');
            });
            if (check && arr.length !== 0) {
                selectedElements.forEach((e) => e.classList.add('selection'));
                selectedElements.forEach((e) => e.classList.remove('target'));
                finishLevel();
            } else {
                selectedElements.forEach((e) => {
                    console.log('wrong select fired');
                    e.classList.add('wrong');
                    e.addEventListener('animationend', () => {
                        e.classList.remove('wrong');
                    });
                });
            }
        };

        const handleSelectorApply = (e: Event) => {
            const input = e.target as HTMLInputElement;
            input.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter') {
                    return;
                }
                selectorApply(input);
            });
            input.removeEventListener('click', handleSelectorApply);
        };

        const handleClickSelectorApply = () => {
            const input = document.querySelector('input') as HTMLInputElement;
            selectorApply(input);
        };

        const handleLevelReset = () => {
            document.querySelectorAll('.levels__item').forEach((e, index) => {
                localStorage.setItem(`level_${index + 1}`, '');
                e.classList.remove('levels__item_passed');
            });
            clearHTMLField();
            clearTable();
            clearLevelHightlight();
            localStorage.setItem('currentLevel', '1');
            localStorage.setItem('title', 'Square');
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
        document.querySelector('.css-editor__apply')?.addEventListener('click', handleClickSelectorApply);
    }

    levelOne() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = 'square';
        localStorage.setItem('hint', 'square');

        const lv = document.querySelector('.level1') as Element;
        const table = lv?.querySelector('.table1') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block1') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelTwo() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = 'jar circle';
        localStorage.setItem('hint', 'jar circle');

        const lv = document.querySelector('.level2') as Element;
        const table = lv?.querySelector('.table2') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block2') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelThree() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = 'circle:first-child, circle:last-child';
        localStorage.setItem('hint', 'circle:first-child, circle:last-child');

        const lv = document.querySelector('.level3') as Element;
        const table = lv?.querySelector('.table3') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block3') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelFour() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = '#purple';
        localStorage.setItem('hint', '#purple');

        const lv = document.querySelector('.level4') as Element;
        const table = lv?.querySelector('.table4') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block4') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelFive() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = 'jar>circle#purple';
        localStorage.setItem('hint', 'jar>circle#purple');

        const lv = document.querySelector('.level5') as Element;
        const table = lv?.querySelector('.table5') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block5') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelSix() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = 'square.small';
        localStorage.setItem('hint', 'square.small');

        const lv = document.querySelector('.level6') as Element;
        const table = lv?.querySelector('.table6') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block6') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelSeven() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = 'circle.small[angry]';
        localStorage.setItem('hint', 'circle.small[angry]');

        const lv = document.querySelector('.level7') as Element;
        const table = lv?.querySelector('.table7') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block7') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelEight() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = 'square:nth-child(3)';
        localStorage.setItem('hint', 'square:nth-child(3)');

        const lv = document.querySelector('.level8') as Element;
        const table = lv?.querySelector('.table8') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block8') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelNine() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = 'circle.small:not[angry]';
        localStorage.setItem('hint', 'circle.small:not[angry]');

        const lv = document.querySelector('.level9') as Element;
        const table = lv?.querySelector('.table9') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block9') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }

    levelTen() {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = '*';
        localStorage.setItem('hint', '*');

        const lv = document.querySelector('.level10') as Element;
        const table = lv?.querySelector('.table10') as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector('.html-block10') as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }
}
