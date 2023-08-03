const clearLevelHightlight = () => {
    document.querySelectorAll('.levels__item').forEach((l) => {
        l.classList.remove('levels__item_active');
    });
};

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
                    this.levelAction('1', 'square');
                    break;
                case '2':
                    this.levelAction('2', 'jar circle');
                    break;
                case '3':
                    this.levelAction('3', 'circle:first-child, circle:last-child');
                    break;
                case '4':
                    this.levelAction('4', '#purple');
                    break;
                case '5':
                    this.levelAction('5', 'jar>circle#purple');
                    break;
                case '6':
                    this.levelAction('6', 'square.small');
                    break;
                case '7':
                    this.levelAction('7', 'circle.small[angry]');
                    break;
                case '8':
                    this.levelAction('8', 'square:nth-child(3)');
                    break;
                case '9':
                    this.levelAction('9', 'circle.small:not[angry]');
                    break;
                case '10':
                    this.levelAction('10', '*');
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
                    this.levelAction('1', 'square');
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
                    (_item_) => {
                        const hoveredElement = _item_.target as HTMLElement;
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

    levelAction(level: string, selector: string) {
        const hint = document.querySelector('.css-editor__hint') as HTMLElement;
        hint.innerHTML = selector;
        localStorage.setItem('hint', selector);

        const lv = document.querySelector(`.level${level}`) as Element;
        const table = lv?.querySelector(`.table${level}`) as Element;
        this.table?.appendChild(table?.cloneNode(true));
        const text = document.querySelector(`.html-block${level}`) as Element;
        this.HTMLField.appendChild(text?.cloneNode(true));
    }
}
