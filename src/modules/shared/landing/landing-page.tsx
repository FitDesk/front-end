import { HeroSection } from "@/modules/shared/landing/components/hero-section"
import { StatsSection } from "@/modules/shared/landing/components/stats-section";
import { PriceSection } from "./components/price-section";

const LandingPage = () => {
    return (
        <div>
            <HeroSection />
            <StatsSection />
            <PriceSection />
        </div>
    )
}
export default LandingPage;
