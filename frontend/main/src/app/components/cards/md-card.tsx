import { Card } from "@/app/ui/card";

export function MdCard() {
    return(
        <Card
        imgSrc="/leonkennedy.jpg"
        imgAlt="s kennedy "
        imgHeight={1000}
        imgWidth={900}
        size="md"
        variant="outlined"
        tone="secondary"
        className="rounded-4xl"
        title="titel"
        description="discription discription discription discription discription discription discription discription">
        </Card>
    );
}