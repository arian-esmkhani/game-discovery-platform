import { FirstSliderSection } from "../components/home/first-slider-section";
import { HeadCard } from "../components/home/head-card";
import { LastSliderSection } from "../components/home/last-slider-section";
import { NostalgySection } from "../components/home/nostalgy-section";
import { Links } from "../components/links";

export function MainHome() {
    return(
        <main>
            <HeadCard/>
            <Links className="md:ml-[19vw] lg:ml-[31vw] mt-8"/>
            <FirstSliderSection/>
            <NostalgySection/>
            <LastSliderSection/>
        </main>
    ) 
}