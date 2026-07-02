import { Card } from "@/app/ui/card";

export function LgCard() {
    return(
        <Card
        imgSrc="/leonkennedy.jpg"
        imgAlt="s kennedy "
        imgHeight={1000}
        imgWidth={900}
        size="lg"
        variant="elevated"
        tone="primary"
        className="hover:shadow-blue-500 opacity-100 hover:opacity-90"
        title="titel"
        description="discription discription discription discription discription discription discription discription">
        </Card>
    );
}