import { Card } from "@/app/ui/card";

export function SmCard() {
    return(
        <Card
        imgSrc="/leonkennedy.jpg"
        imgAlt="s kennedy "
        imgHeight={200}
        imgWidth={200}
        size="sm"
        variant="neutral"
        tone="secondary"
        className="rounded-4xl hover:scale-110"
        title="titel">
        </Card>
    );
}