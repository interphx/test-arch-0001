import { MainMenuScreen } from './main-menu';
import { GameplayScreen } from './gameplay';

export { MainMenuScreen, GameplayScreen };

export type Screen = MainMenuScreen | GameplayScreen;
export type ScreenName = Screen['type'];