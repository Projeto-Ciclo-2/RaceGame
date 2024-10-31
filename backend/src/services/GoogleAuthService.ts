import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

export default class GoogleAuth {
	constructor() {
		this.initialize();
	}

	private initialize() {
		passport.use(
			new GoogleStrategy(
				{
					clientID: process.env.GOOGLE_CLIENT_ID!,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
					callbackURL: process.env.GOOGLE_CALLBACK_URL!,
				},
				this.verifyCallback
			)
		);

		passport.serializeUser(this.serializeUser);
		passport.deserializeUser(this.deserializeUser);
	}

	private verifyCallback(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: (error: any, user?: any) => void
	) {
		// Aqui você pode salvar as informações do usuário no banco de dados
		done(null, profile);
	}

	private serializeUser(
		user: Express.User,
		done: (error: any, id?: any) => void
	) {
		done(null, user);
	}

	private deserializeUser(
		user: Express.User,
		done: (error: any, user?: any) => void
	) {
		done(null, user);
	}
}
