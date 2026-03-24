import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { emojiList, utilityEmojiList } from './emojiList';

import { svg as grapeSvg } from '../../assets/svg_emojis/grape';
import { svg as melonSvg } from '../../assets/svg_emojis/melon';
import { svg as watermelonSvg } from '../../assets/svg_emojis/watermelon';
import { svg as tangerineSvg } from '../../assets/svg_emojis/tangerine';
import { svg as lemonSvg } from '../../assets/svg_emojis/lemon';
import { svg as bananaSvg } from '../../assets/svg_emojis/banana';
import { svg as pineappleSvg } from '../../assets/svg_emojis/pineapple';
import { svg as mangoSvg } from '../../assets/svg_emojis/mango';
import { svg as appleRedSvg } from '../../assets/svg_emojis/appleRed';
import { svg as appleGreenSvg } from '../../assets/svg_emojis/appleGreen';
import { svg as pearSvg } from '../../assets/svg_emojis/pear';
import { svg as peachSvg } from '../../assets/svg_emojis/peach';
import { svg as cherriesSvg } from '../../assets/svg_emojis/cherries';
import { svg as strawberrySvg } from '../../assets/svg_emojis/strawberry';
import { svg as kiwiSvg } from '../../assets/svg_emojis/kiwi';
import { svg as tomatoSvg } from '../../assets/svg_emojis/tomato';
import { svg as oliveSvg } from '../../assets/svg_emojis/olive';
import { svg as coconutSvg } from '../../assets/svg_emojis/coconut';
import { svg as avocadoSvg } from '../../assets/svg_emojis/avocado';
import { svg as eggplantSvg } from '../../assets/svg_emojis/eggplant';
import { svg as potatoSvg } from '../../assets/svg_emojis/potato';
import { svg as carrotSvg } from '../../assets/svg_emojis/carrot';
import { svg as cornSvg } from '../../assets/svg_emojis/corn';
import { svg as hotPepperSvg } from '../../assets/svg_emojis/hotPepper';
import { svg as cucumberSvg } from '../../assets/svg_emojis/cucumber';
import { svg as leafyGreenSvg } from '../../assets/svg_emojis/leafyGreen';
import { svg as broccoliSvg } from '../../assets/svg_emojis/broccoli';
import { svg as garlicSvg } from '../../assets/svg_emojis/garlic';
import { svg as onionSvg } from '../../assets/svg_emojis/onion';
import { svg as mushroomSvg } from '../../assets/svg_emojis/mushroom';
import { svg as peanutsSvg } from '../../assets/svg_emojis/peanuts';
import { svg as chestnutSvg } from '../../assets/svg_emojis/chestnut';
import { svg as breadSvg } from '../../assets/svg_emojis/bread';
import { svg as croissantSvg } from '../../assets/svg_emojis/croissant';
import { svg as baguetteSvg } from '../../assets/svg_emojis/baguette';
import { svg as flatbreadSvg } from '../../assets/svg_emojis/flatbread';
import { svg as pretzelSvg } from '../../assets/svg_emojis/pretzel';
import { svg as bagelSvg } from '../../assets/svg_emojis/bagel';
import { svg as pancakesSvg } from '../../assets/svg_emojis/pancakes';
import { svg as cheeseSvg } from '../../assets/svg_emojis/cheese';
import { svg as meatBoneSvg } from '../../assets/svg_emojis/meatBone';
import { svg as poultryLegSvg } from '../../assets/svg_emojis/poultryLeg';
import { svg as cutMeatSvg } from '../../assets/svg_emojis/cutMeat';
import { svg as baconSvg } from '../../assets/svg_emojis/bacon';
import { svg as hamburgerSvg } from '../../assets/svg_emojis/hamburger';
import { svg as frenchFriesSvg } from '../../assets/svg_emojis/frenchFries';
import { svg as pizzaSvg } from '../../assets/svg_emojis/pizza';
import { svg as hotDogSvg } from '../../assets/svg_emojis/hotDog';
import { svg as sandwichSvg } from '../../assets/svg_emojis/sandwich';
import { svg as tacoSvg } from '../../assets/svg_emojis/taco';
import { svg as burritoSvg } from '../../assets/svg_emojis/burrito';
import { svg as stuffedFlatbreadSvg } from '../../assets/svg_emojis/stuffedFlatbread';
import { svg as eggSvg } from '../../assets/svg_emojis/egg';
import { svg as cookingEggSvg } from '../../assets/svg_emojis/cookingEgg';
import { svg as shallowPanSvg } from '../../assets/svg_emojis/shallowPan';
import { svg as potFoodSvg } from '../../assets/svg_emojis/potFood';
import { svg as fondueSvg } from '../../assets/svg_emojis/fondue';
import { svg as bowlSpoonSvg } from '../../assets/svg_emojis/bowlSpoon';
import { svg as greenSaladSvg } from '../../assets/svg_emojis/greenSalad';
import { svg as popcornSvg } from '../../assets/svg_emojis/popcorn';
import { svg as saltSvg } from '../../assets/svg_emojis/salt';
import { svg as cannedFoodSvg } from '../../assets/svg_emojis/cannedFood';
import { svg as bentoSvg } from '../../assets/svg_emojis/bento';
import { svg as riceBallSvg } from '../../assets/svg_emojis/riceBall';
import { svg as cookedRiceSvg } from '../../assets/svg_emojis/cookedRice';
import { svg as curryRiceSvg } from '../../assets/svg_emojis/curryRice';
import { svg as steamingBowlSvg } from '../../assets/svg_emojis/steamingBowl';
import { svg as spaghettiSvg } from '../../assets/svg_emojis/spaghetti';
import { svg as sweetPotatoSvg } from '../../assets/svg_emojis/sweetPotato';
import { svg as odenSvg } from '../../assets/svg_emojis/oden';
import { svg as sushiSvg } from '../../assets/svg_emojis/sushi';
import { svg as friedShrimpSvg } from '../../assets/svg_emojis/friedShrimp';
import { svg as fishCakeSvg } from '../../assets/svg_emojis/fishCake';
import { svg as moonCakeSvg } from '../../assets/svg_emojis/moonCake';
import { svg as dangoSvg } from '../../assets/svg_emojis/dango';
import { svg as dumplingSvg } from '../../assets/svg_emojis/dumpling';
import { svg as fortuneCookieSvg } from '../../assets/svg_emojis/fortuneCookie';
import { svg as takeoutBoxSvg } from '../../assets/svg_emojis/takeoutBox';
import { svg as crabSvg } from '../../assets/svg_emojis/crab';
import { svg as lobsterSvg } from '../../assets/svg_emojis/lobster';
import { svg as shrimpSvg } from '../../assets/svg_emojis/shrimp';
import { svg as squidSvg } from '../../assets/svg_emojis/squid';
import { svg as oysterSvg } from '../../assets/svg_emojis/oyster';
import { svg as softIceCreamSvg } from '../../assets/svg_emojis/softIceCream';
import { svg as shavedIceSvg } from '../../assets/svg_emojis/shavedIce';
import { svg as iceCreamSvg } from '../../assets/svg_emojis/iceCream';
import { svg as doughnutSvg } from '../../assets/svg_emojis/doughnut';
import { svg as cookieSvg } from '../../assets/svg_emojis/cookie';
import { svg as birthdayCakeSvg } from '../../assets/svg_emojis/birthdayCake';
import { svg as shortcakeSvg } from '../../assets/svg_emojis/shortcake';
import { svg as cupcakeSvg } from '../../assets/svg_emojis/cupcake';
import { svg as pieSvg } from '../../assets/svg_emojis/pie';
import { svg as chocolateBarSvg } from '../../assets/svg_emojis/chocolateBar';
import { svg as candySvg } from '../../assets/svg_emojis/candy';
import { svg as lollipopSvg } from '../../assets/svg_emojis/lollipop';
import { svg as custardSvg } from '../../assets/svg_emojis/custard';
import { svg as honeyPotSvg } from '../../assets/svg_emojis/honeyPot';
import { svg as glassMilkSvg } from '../../assets/svg_emojis/glassMilk';
import { svg as babyBottleSvg } from '../../assets/svg_emojis/babyBottle';
import { svg as hotBeverageSvg } from '../../assets/svg_emojis/hotBeverage';
import { svg as teapotSvg } from '../../assets/svg_emojis/teapot';
import { svg as teacupSvg } from '../../assets/svg_emojis/teacup';
import { svg as sakeSvg } from '../../assets/svg_emojis/sake';
import { svg as champagneSvg } from '../../assets/svg_emojis/champagne';
import { svg as wineGlassSvg } from '../../assets/svg_emojis/wineGlass';
import { svg as cocktailGlassSvg } from '../../assets/svg_emojis/cocktailGlass';
import { svg as tropicalDrinkSvg } from '../../assets/svg_emojis/tropicalDrink';
import { svg as beerMugSvg } from '../../assets/svg_emojis/beerMug';
import { svg as clinkingBeerSvg } from '../../assets/svg_emojis/clinkingBeer';
import { svg as clinkingGlassesSvg } from '../../assets/svg_emojis/clinkingGlasses';
import { svg as tumblerGlassSvg } from '../../assets/svg_emojis/tumblerGlass';
import { svg as pouringLiquidSvg } from '../../assets/svg_emojis/pouringLiquid';
import { svg as cupStrawSvg } from '../../assets/svg_emojis/cupStraw';
import { svg as bubbleTeaSvg } from '../../assets/svg_emojis/bubbleTea';
import { svg as beverageBoxSvg } from '../../assets/svg_emojis/beverageBox';
import { svg as mateSvg } from '../../assets/svg_emojis/mate';
import { svg as iceSvg } from '../../assets/svg_emojis/ice';
import { svg as jarSvg } from '../../assets/svg_emojis/jar';
import { svg as chopsticksSvg } from '../../assets/svg_emojis/chopsticks';
import { svg as forkKnifePlateSvg } from '../../assets/svg_emojis/forkKnifePlate';
import { svg as forkKnifeSvg } from '../../assets/svg_emojis/forkKnife';
import { svg as spoonSvg } from '../../assets/svg_emojis/spoon';
import { svg as kitchenKnifeSvg } from '../../assets/svg_emojis/kitchenKnife';
import { svg as amphoraSvg } from '../../assets/svg_emojis/amphora';
import { svg as cowSvg } from '../../assets/svg_emojis/cow';
import { svg as pigSvg } from '../../assets/svg_emojis/pig';
import { svg as sheepSvg } from '../../assets/svg_emojis/sheep';
import { svg as rabbitSvg } from '../../assets/svg_emojis/rabbit';
import { svg as turkeySvg } from '../../assets/svg_emojis/turkey';
import { svg as chickenSvg } from '../../assets/svg_emojis/chicken';
import { svg as duckSvg } from '../../assets/svg_emojis/duck';
import { svg as gooseSvg } from '../../assets/svg_emojis/goose';
import { svg as fishSvg } from '../../assets/svg_emojis/fish';
import { svg as tropicalFishSvg } from '../../assets/svg_emojis/tropicalFish';
import { svg as blowfishSvg } from '../../assets/svg_emojis/blowfish';
import { svg as octopusSvg } from '../../assets/svg_emojis/octopus';
import { svg as spiralShellSvg } from '../../assets/svg_emojis/spiralShell';
import { svg as snailSvg } from '../../assets/svg_emojis/snail';
import { svg as droolingFaceSvg } from '../../assets/svg_emojis/droolingFace';
import { svg as sleepingFaceSvg } from '../../assets/svg_emojis/sleepingFace';
import { svg as wearyFaceSvg } from '../../assets/svg_emojis/wearyFace';
import { svg as fireSvg } from '../../assets/svg_emojis/fire';
import { svg as magnifyingGlassSvg } from '../../assets/svg_emojis/magnifyingGlass';
import { svg as rulerSvg } from '../../assets/svg_emojis/ruler';
import { svg as flexedBicepsSvg } from '../../assets/svg_emojis/flexedBiceps';
import { svg as silhouetteSvg } from '../../assets/svg_emojis/silhouette';
import { svg as footprintsSvg } from '../../assets/svg_emojis/footprints';
import { svg as houseSvg } from '../../assets/svg_emojis/house';
import { svg as personRunningSvg } from '../../assets/svg_emojis/personRunning';
import { svg as crossMarkSvg } from '../../assets/svg_emojis/crossMark';
import { svg as lightningSvg } from '../../assets/svg_emojis/lightning';
import { svg as warningSvg } from '../../assets/svg_emojis/warning';
import { svg as balanceScaleSvg } from '../../assets/svg_emojis/balanceScale';
import { svg as lowBatterySvg } from '../../assets/svg_emojis/lowBattery';
import { svg as pencilSvg } from '../../assets/svg_emojis/pencil';

const emojiSvgMap: Record<string, string> = {
  '🍇': grapeSvg,
  '🍈': melonSvg,
  '🍉': watermelonSvg,
  '🍊': tangerineSvg,
  '🍋': lemonSvg,
  '🍌': bananaSvg,
  '🍍': pineappleSvg,
  '🥭': mangoSvg,
  '🍎': appleRedSvg,
  '🍏': appleGreenSvg,
  '🍐': pearSvg,
  '🍑': peachSvg,
  '🍒': cherriesSvg,
  '🍓': strawberrySvg,
  '🥝': kiwiSvg,
  '🍅': tomatoSvg,
  '🫒': oliveSvg,
  '🥥': coconutSvg,
  '🥑': avocadoSvg,
  '🍆': eggplantSvg,
  '🥔': potatoSvg,
  '🥕': carrotSvg,
  '🌽': cornSvg,
  '🌶️': hotPepperSvg,
  '🥒': cucumberSvg,
  '🥬': leafyGreenSvg,
  '🥦': broccoliSvg,
  '🧄': garlicSvg,
  '🧅': onionSvg,
  '🍄': mushroomSvg,
  '🥜': peanutsSvg,
  '🌰': chestnutSvg,
  '🍞': breadSvg,
  '🥐': croissantSvg,
  '🥖': baguetteSvg,
  '🫓': flatbreadSvg,
  '🥨': pretzelSvg,
  '🥯': bagelSvg,
  '🥞': pancakesSvg,
  '🧀': cheeseSvg,
  '🍖': meatBoneSvg,
  '🍗': poultryLegSvg,
  '🥩': cutMeatSvg,
  '🥓': baconSvg,
  '🍔': hamburgerSvg,
  '🍟': frenchFriesSvg,
  '🍕': pizzaSvg,
  '🌭': hotDogSvg,
  '🥪': sandwichSvg,
  '🌮': tacoSvg,
  '🌯': burritoSvg,
  '🥙': stuffedFlatbreadSvg,
  '🥚': eggSvg,
  '🍳': cookingEggSvg,
  '🥘': shallowPanSvg,
  '🍲': potFoodSvg,
  '🫕': fondueSvg,
  '🥣': bowlSpoonSvg,
  '🥗': greenSaladSvg,
  '🍿': popcornSvg,
  '🧂': saltSvg,
  '🥫': cannedFoodSvg,
  '🍱': bentoSvg,
  '🍙': riceBallSvg,
  '🍚': cookedRiceSvg,
  '🍛': curryRiceSvg,
  '🍜': steamingBowlSvg,
  '🍝': spaghettiSvg,
  '🍠': sweetPotatoSvg,
  '🍢': odenSvg,
  '🍣': sushiSvg,
  '🍤': friedShrimpSvg,
  '🍥': fishCakeSvg,
  '🥮': moonCakeSvg,
  '🍡': dangoSvg,
  '🥟': dumplingSvg,
  '🥠': fortuneCookieSvg,
  '🥡': takeoutBoxSvg,
  '🦀': crabSvg,
  '🦞': lobsterSvg,
  '🦐': shrimpSvg,
  '🦑': squidSvg,
  '🦪': oysterSvg,
  '🍦': softIceCreamSvg,
  '🍧': shavedIceSvg,
  '🍨': iceCreamSvg,
  '🍩': doughnutSvg,
  '🍪': cookieSvg,
  '🎂': birthdayCakeSvg,
  '🍰': shortcakeSvg,
  '🧁': cupcakeSvg,
  '🥧': pieSvg,
  '🍫': chocolateBarSvg,
  '🍬': candySvg,
  '🍭': lollipopSvg,
  '🍮': custardSvg,
  '🍯': honeyPotSvg,
  '🥛': glassMilkSvg,
  '🍼': babyBottleSvg,
  '☕': hotBeverageSvg,
  '🫖': teapotSvg,
  '🍵': teacupSvg,
  '🍶': sakeSvg,
  '🍾': champagneSvg,
  '🍷': wineGlassSvg,
  '🍸': cocktailGlassSvg,
  '🍹': tropicalDrinkSvg,
  '🍺': beerMugSvg,
  '🍻': clinkingBeerSvg,
  '🥂': clinkingGlassesSvg,
  '🥃': tumblerGlassSvg,
  '🫗': pouringLiquidSvg,
  '🥤': cupStrawSvg,
  '🧋': bubbleTeaSvg,
  '🧃': beverageBoxSvg,
  '🧉': mateSvg,
  '🧊': iceSvg,
  '🫙': jarSvg,
  '🥢': chopsticksSvg,
  '🍽️': forkKnifePlateSvg,
  '🍴': forkKnifeSvg,
  '🥄': spoonSvg,
  '🔪': kitchenKnifeSvg,
  '🏺': amphoraSvg,
  '🐮': cowSvg,
  '🐷': pigSvg,
  '🐑': sheepSvg,
  '🐇': rabbitSvg,
  '🦃': turkeySvg,
  '🐔': chickenSvg,
  '🦆': duckSvg,
  '🪿': gooseSvg,
  '🐟': fishSvg,
  '🐠': tropicalFishSvg,
  '🐡': blowfishSvg,
  '🐙': octopusSvg,
  '🐚': spiralShellSvg,
  '🐌': snailSvg,
  '🤤': droolingFaceSvg,
  '😴': sleepingFaceSvg,
  '😫': wearyFaceSvg,
  '🔥': fireSvg,
  '🔍': magnifyingGlassSvg,
  '📏': rulerSvg,
  '💪': flexedBicepsSvg,
  '👤': silhouetteSvg,
  '👣': footprintsSvg,
  '🏠': houseSvg,
  '🏃': personRunningSvg,
  '❌': crossMarkSvg,
  '⚡': lightningSvg,
  '⚠️': warningSvg,
  '⚖️': balanceScaleSvg,
  '🪫': lowBatterySvg,
  '✏️': pencilSvg,
};

export type ComponentEmojiProps = {
  text: string;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  width?: string;
  height?: string;
}

export class ComponentEmoji extends LitElement {
  @property({ type: String }) text = '';
  @property({ type: String, reflect: true }) size = 'm';
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';

  static styles = css`
    :host {
      display: inline-block;
      line-height: 1;
      color: currentColor;
    }
    :host([size="xs"]) { --emoji-size: 0.8rem; }
    :host([size="s"]) { --emoji-size: 1.2rem; }
    :host([size="m"]) { --emoji-size: 2rem; }
    :host([size="l"]) { --emoji-size: 3rem; }
    :host([size="xl"]) { --emoji-size: 5rem; }

    .emoji {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
        cursor: default;
        width: var(--emoji-width, var(--emoji-size, 2rem));
        height: var(--emoji-height, var(--emoji-size, 2rem));
        color: inherit;
    }
    .emoji:hover {Ángel Hita <angel.hita@BEST.eu.org>
        transform: scale(1.2);
    }
    .emoji svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
    }
  `;

  private _getSvg(emoji: string): string {
    return emojiSvgMap[emoji] || '';
  }

  private _getEmoji(): string {
    const normalizedText = this.text ? this.text.toLowerCase().trim() : '';

    if (!normalizedText) return '🫙';

    const allEmojis = [...emojiList, ...utilityEmojiList];
    for (const item of allEmojis) {
      if (item.keywords.some(keyword => keyword.toLowerCase() === normalizedText)) {
        return item.emoji;
      }
    }
    for (const item of allEmojis) {
      if (item.keywords.some(keyword => normalizedText.includes(keyword.toLowerCase()))) {
        return item.emoji;
      }
    }
    return this._getRandomEmoji(normalizedText);
  }

  private _getRandomEmoji(input: string): string {
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0;
    }

    const index = Math.abs(hash) % emojiList.length;
    return emojiList[index].emoji;
  }

  render() {
    const emoji = this._getEmoji();
    const svg = this._getSvg(emoji);
    const style = [
      this.width ? `--emoji-width: ${this.width}` : '',
      this.height ? `--emoji-height: ${this.height}` : '',
    ].filter(Boolean).join(';');
    return html`<span class="emoji" role="img" aria-label="${this.text}" style="${style}">${this._unsafeSvg(svg)}</span>`;
  }

  private _unsafeSvg(svg: string) {
    const template = document.createElement('template');
    template.innerHTML = svg;
    return template.content.cloneNode(true);
  }
}
