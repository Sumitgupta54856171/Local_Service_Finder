import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"


export function CardImage({Contentheader,category,latitude,longitude,rating,created,Linkurl,clickhandler}) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{category}</Badge>
        </CardAction>
        <CardTitle>{Contentheader}</CardTitle>
        <CardDescription className="space-x-2">
          lat: {latitude}, lng: {longitude} | Rating: {rating} | Created: {created}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-20" onClick={clickhandler}>
          Navigate
        </Button>
        <Button className="w-full"><Link href={Linkurl}>View Details</Link></Button>
      </CardFooter>
    </Card>
  )
}
