(function () {
    const addStyles = () => {
        const styles = `
            #effectivness {
                position: absolute;
                right: 5px;
                top: 7px;
                text-shadow: 0px 0px 4px #000,0px 1px 0px #000;
                font-weight: bold;
                color: #6f6;
            }
            
            .iconButton {
                display: inline-block;
                width: 30px;
                height: 30px;
                background-image: url(img/icons.png?v=2.031);
                cursor: pointer;
                box-shadow: 0px 0px 3px 1px rgba(255,255,255,0.2) inset;
                margin: 2px;
                background-position: 0 -382px;
                padding: 8px;
                border: 2px solid transparent;
            }
            
            .activeIconButton {
                border: 2px solid rgb(184, 255, 97);';
            }
            
            .iconButton.shimmersIcon {
                background-position: -480px -672px;
            }
        
            .iconButton.autoclickIcon {
                background-position:0 -672px;
            }
        
            .iconButton.effectivenessIcon {
                background-position:-578px -1586px;
            }
        
            .iconButton.wrinklersIcon {
                background-position:-912px -384px;
            }
            
            .progressContainer {
                position: relative;
                display: inline-flex;
                background: rgba(70, 70, 70, 0.6);
                margin-right: 10px;
            }
            
            .progressBar {
                height: 15px;
                background: #a8ff3d;
                display: inline-block;
            }
            
            .progressOverlay {
                position: absolute;
                left: 0;
                height: 15px;
                background: #ffd800;
                display: inline-block;
                mix-blend-mode: hue;
            }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(styles));
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    const logEnable = (func) =>
        console.log(
            `%c${func} enabled`,
            'color: black; font-style: italic; background-color: #b8ff61; padding: 2px 10px;',
        );
    const logDisable = (func) =>
        console.log(
            `%c${func} disabled`,
            'color: black; font-style: italic; background-color: #ff6161; padding: 2px 10px;',
        );

    let autoclickActive = false;
    let cookieTimerId;
    const toggleAutoclickCookie = () => {
        if (autoclickActive) {
            clearInterval(cookieTimerId);
            autoclickActive = false;
            logDisable('Autoclicking big cookie');
            Game.UpdateMenu();
            return;
        }
        const cookie = document.querySelector('#bigCookie');
        cookieTimerId = setInterval(() => cookie && cookie.click(), 10);
        autoclickActive = true;
        logEnable('Autoclicking big cookie');
        Game.UpdateMenu();
    };

    let clickShimmersActive = false;
    let shimmerIntervalId;
    const toggleClickShimmers = () => {
        if (clickShimmersActive) {
            clearInterval(shimmerIntervalId);
            clickShimmersActive = false;
            logDisable('Autoclicking shimmers');
            Game.UpdateMenu();
            return;
        }
        const audioAlert = new Audio(
            'http://www.orangefreesounds.com/wp-content/uploads/2018/11/Cat-meow-audio-clip.mp3',
        );
        audioAlert.volume = 0.05;
        audioAlert.addEventListener('loadeddata', () => {
            if (audioAlert.readyState >= 2) audioAlert.play();
        });
        shimmerIntervalId = setInterval(() => {
            const shimmers = document.querySelectorAll('#shimmers .shimmer');
            if (shimmers.length > 0) {
                audioAlert.play();
                shimmers.forEach((shimmer) => shimmer.click());
            }
        }, 1500);
        clickShimmersActive = true;
        logEnable('Autoclicking shimmers');
        Game.UpdateMenu();
    };

    let popWrinklersActive = false;
    let noWrinklerIntervalId;
    const togglePopWrinklers = () => {
        if (popWrinklersActive) {
            clearInterval(noWrinklerIntervalId);
            popWrinklersActive = false;
            logDisable('Popping wrinklers');
            Game.UpdateMenu();
            return;
        }
        noWrinklerIntervalId = setInterval(() => {
            const wrinklersPopCondition = Game.wrinklers.reduce(
                (acc, val) => acc && ((val.close > 0 && val.sucked > 0) || val.close <= 0),
                true,
            );
            if (wrinklersPopCondition) {
                Game.CollectWrinklers();
            }
        }, 5000);
        popWrinklersActive = true;
        logEnable('Popping wrinklers');
        Game.UpdateMenu();
    };

    let showEffectivenessActive = false;
    const toggleShowEffectiveness = () => {
        if (showEffectivenessActive) {
            return;
        }
        document.querySelectorAll('.product').forEach((product) => {
            const handler = () => {
                let effArray = Game.ObjectsById.map((obj) => (obj.storedCps / obj.price) * 100);
                let max = Math.max(...effArray);
                let multiplier = 1;
                while (max < 100) {
                    multiplier *= 10;
                    max *= 10;
                }
                multiplier /= max / 100;
                effArray = effArray.map((eff) => eff * multiplier);
                const orderedEffArray = [...effArray].sort((a, b) => b - a);
                document.querySelectorAll('.product').forEach((product, index) => {
                    let effectivness = product.querySelector('#effectivness');
                    if (!effectivness) {
                        effectivness = document.createElement('span');
                        effectivness.id = 'effectivness';
                        product.appendChild(effectivness);
                    }
                    const eff = effArray[index];
                    if (orderedEffArray.indexOf(eff) < 2) {
                        effectivness.style.color = '#61c9ff';
                    } else if (orderedEffArray.indexOf(eff) < 5) {
                        effectivness.style.color = '#b8ff61';
                    } else if (orderedEffArray.indexOf(eff) < 10) {
                        effectivness.style.color = '#ffe761';
                    } else {
                        effectivness.style.color = '#ff6161';
                    }
                    effectivness.innerHTML = `${eff.toFixed(2)} %`;
                });
            };
            handler();
            product.addEventListener('click', () => setTimeout(handler, 200));
        });
        showEffectivenessActive = true;
        logEnable('Effectiveness display');
        Game.UpdateMenu();
    };

    const createElement = ({tag, classes, text, children, onClick, style}) => {
        const el = document.createElement(tag);

        if (classes) {
            classes.filter(Boolean).forEach((cl) => el.classList.add(cl));
        }
        if (text) {
            el.innerHTML = text;
        }
        if (children) {
            children.filter(Boolean).forEach((child) => el.appendChild(child));
        }
        if (onClick) {
            el.onclick = onClick;
        }
        if (style) {
            el.style = style;
        }

        return el;
    };

    const addMenu = () => {
        if (Game.onMenu !== 'stats') return;

        const statisticsTitle = document.querySelector('#menu > .section');

        if (!statisticsTitle) return;

        const progressMaxWidth = 200;
        const min = Game.shimmerTypes.golden.minTime;
        const time = Game.shimmerTypes.golden.time;
        const max = Game.shimmerTypes.golden.maxTime;

        const subsection = createElement({
            tag: 'div',
            classes: ['subsection'],
            children: [
                createElement({
                    tag: 'div',
                    classes: ['title'],
                    text: 'Personal',
                }),
                createElement({
                    tag: 'div',
                    classes: ['listing'],
                    children: [
                        createElement({
                            tag: 'span',
                            classes: ['iconButton', 'autoclickIcon', autoclickActive && 'activeIconButton'],
                            onClick: toggleAutoclickCookie,
                        }),
                        createElement({
                            tag: 'span',
                            classes: ['iconButton', 'shimmersIcon', clickShimmersActive && 'activeIconButton'],
                            onClick: toggleClickShimmers,
                        }),
                        createElement({
                            tag: 'span',
                            classes: ['iconButton', 'wrinklersIcon', popWrinklersActive && 'activeIconButton'],
                            onClick: togglePopWrinklers,
                        }),
                        createElement({
                            tag: 'span',
                            classes: ['iconButton', 'effectivenessIcon', showEffectivenessActive && 'activeIconButton'],
                            onClick: toggleShowEffectiveness,
                        }),
                    ],
                }),
                createElement({
                    tag: 'div',
                    classes: ['listing'],
                    children: [
                        createElement({
                            tag: 'div',
                            classes: ['subsection'],
                            children: [
                                createElement({
                                    tag: 'div',
                                    classes: ['progressContainer'],
                                    style: `width: ${progressMaxWidth}px`,
                                    children: [
                                        createElement({
                                            tag: 'div',
                                            classes: ['progressBar'],
                                            style: `width: ${Math.round((time / max) * progressMaxWidth)}px`,
                                        }),
                                        createElement({
                                            tag: 'div',
                                            classes: ['progressOverlay'],
                                            style: `width: ${Math.round((min / max) * progressMaxWidth)}px`,
                                        }),
                                    ],
                                }),
                                createElement({
                                    tag: 'span',
                                    text: `${Math.round((max - time) / Game.fps)} ${
                                        Game.shimmerTypes.golden.spawned === 1 ? '(spawned)' : ''
                                    }`,
                                }),
                            ],
                        }),
                    ],
                }),
                createElement({
                    tag: 'div',
                    classes: ['listing'],
                    children: [
                        createElement({
                            tag: 'b',
                            text: '"Lucky!" Cookies required :',
                        }),
                        createElement({
                            tag: 'div',
                            classes: ['price', 'plain'],
                            text: `${Game.tinyCookie()}${Beautify(Game.cookiesPsRaw * 6000)}`,
                        }),
                    ],
                }),
                createElement({
                    tag: 'div',
                    classes: ['listing'],
                    children: [
                        createElement({
                            tag: 'b',
                            text: '"Lucky!" Cookies required (Frenzy) :',
                        }),
                        createElement({
                            tag: 'div',
                            classes: ['price', 'plain'],
                            text: `${Game.tinyCookie()}${Beautify(Game.cookiesPsRaw * 6000 * 7)}`,
                        }),
                    ],
                }),
            ],
        });

        statisticsTitle.parentNode.insertBefore(subsection, statisticsTitle.nextElementSibling);
    };

    addStyles();
    if (!window.BackupUpdateMenu) window.BackupUpdateMenu = Game.UpdateMenu;
    Game.UpdateMenu = () => {
        window.BackupUpdateMenu();
        addMenu();
    };
    Game.UpdateMenu();
})();
