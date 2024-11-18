import { src } from "../../../assets/enum/enumSrc";
import { carOptions } from "../../../interfaces/IAssets";
import { loadImage } from "./imgLoader";

export class ImgHandler {
	private imgs: {
		1: undefined | CanvasImageSource;
		2: undefined | CanvasImageSource;
		3: undefined | CanvasImageSource;
		4: undefined | CanvasImageSource;
		5: undefined | CanvasImageSource;
		6: undefined | CanvasImageSource;
		7: undefined | CanvasImageSource;
		8: undefined | CanvasImageSource;
		9: undefined | CanvasImageSource;
		10: undefined | CanvasImageSource;
		11: undefined | CanvasImageSource;
	} = {
		1: undefined,
		2: undefined,
		3: undefined,
		4: undefined,
		5: undefined,
		6: undefined,
		7: undefined,
		8: undefined,
		9: undefined,
		10: undefined,
		11: undefined,
	};

	constructor() {
		Promise.all([
			loadImage(src.carBlue),
			loadImage(src.carGreen),
			loadImage(src.carPurple),
			loadImage(src.carPink),
			loadImage(src.carCyan),
			loadImage(src.carBlackRed),
			loadImage(src.carOrangeMIN),
			loadImage(src.carWhiteMIN),
			loadImage(src.carOrangeAltMIN),
			loadImage(src.carJadeMIN),
			loadImage(src.carAmethystMIN),
		])
			.then(
				([
					carBlue,
					carGreen,
					carPurple,
					carPink,
					carCyan,
					carBlackRed,
					carOrangeMIN,
					carWhiteMIN,
					carOrangeAltMIN,
					carJadeMIN,
					carAmethystMIN,
				]) => {
					this.imgs[1] = carBlue;
					this.imgs[2] = carGreen;
					this.imgs[3] = carPurple;
					this.imgs[4] = carPink;
					this.imgs[5] = carCyan;
					this.imgs[6] = carBlackRed;
					this.imgs[7] = carOrangeMIN;
					this.imgs[8] = carWhiteMIN;
					this.imgs[9] = carOrangeAltMIN;
					this.imgs[10] = carJadeMIN;
					this.imgs[11] = carAmethystMIN;
				}
			)
			.catch((error) => {
				throw new Error("Was not possible to load images.");
			});
	}

	public getImg(carID: carOptions): CanvasImageSource {
		const desiredCar = this.imgs[carID];
		if (desiredCar) {
			return desiredCar;
		}
		throw new Error("Car not found");
	}
}
