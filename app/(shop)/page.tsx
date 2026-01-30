import {
	FeedbackSection,
	HeroSection,
	MainSection,
} from "@/components/app/home";

const Home = async () => {
	return (
		<div className="w-full">
			<HeroSection />
			<MainSection />
			<FeedbackSection />
		</div>
	);
};

export default Home;
