import blueHaze from "../assets/project-cover-blue-haze.jpg";
import bluePink from "../assets/project-cover-blue-pink.jpg";
import lavender from "../assets/project-cover-lavender.jpg";
import lime from "../assets/project-cover-lime.jpg";
import mintPeach from "../assets/project-cover-mint-peach.jpg";
import pastel from "../assets/project-cover-pastel.jpg";
import peachBlue from "../assets/project-cover-peach-blue.jpg";
import prism from "../assets/project-cover-prism.jpg";
import violet from "../assets/project-cover-violet.jpg";

export const projectCoverBackgrounds = {
	"blue-pink": { label: "Blue & pink", image: bluePink },
	lavender: { label: "Lavender", image: lavender },
	pastel: { label: "Pastel", image: pastel },
	"peach-blue": { label: "Peach & blue", image: peachBlue },
	prism: { label: "Prism", image: prism },
	lime: { label: "Lime", image: lime },
	"blue-haze": { label: "Blue haze", image: blueHaze },
	violet: { label: "Violet", image: violet },
	"mint-peach": { label: "Mint & peach", image: mintPeach },
};

export type ProjectCoverBackground = keyof typeof projectCoverBackgrounds;
export const projectCoverBackgroundIds = Object.keys(
	projectCoverBackgrounds,
) as ProjectCoverBackground[];
